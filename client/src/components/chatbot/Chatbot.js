import React, { Component } from 'react';
import axios from "axios/index";
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';
import { Navbar, Nav, NavDropdown, NavItem } from 'react-bootstrap';

import { text } from 'body-parser';

const cookies = new Cookies();

class Chatbot extends Component {

    messageEnd;
    talkInput;

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            showBot: true
        };
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        if (this.talkInput) {
            this.talkInput.focus();
        }
    }

    show = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showBot: true });
    }

    hide = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showBot: false });
    }

    async df_text_query(queryText) {
        let says = {
            speaks: 'user',
            msg: {
                text: {
                    text: queryText
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says] });
        try {
            const res = await axios.post('/api/df_text_query', { text: queryText, userID: cookies.get('userID') });

            for (let msg of res.data.fulfillmentMessages) {
                console.log(JSON.stringify(msg));
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says] });
            }
        } catch (e) {
            says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having troubles. I need to terminate. will be back later"
                    }
                }
            }
            this.setState({ messages: [...this.state.messages, says] });
            let that = this;
            setTimeout(function () {
                that.setState({ showBot: false })
            }, 2000);
        }
    };

    async df_event_query(eventName) {
        try{

        const res = await axios.post('/api/df_event_query', { event: eventName, userID: cookies.get('userID') });

        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaks: 'bot',
                msg: msg
            }

            this.setState({ messages: [...this.state.messages, says] });
        }
    } catch(e){
        let says = {
            speaks: 'bot',
            msg: {
                text: {
                    text: "I'm having troubles. I need to terminate. will be back later"
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says] });
        let that = this;
        setTimeout(function () {
            that.setState({ showBot: false })
        }, 2000);
    }
    };

    renderCards = (cards) => {
        return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
    }

    renderOneMessage = (message, i) => {
        if (message.msg && message.msg.text && message.msg.text.text) {
            console.log('in if cond');
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        } else if (message.msg && message.msg.payload.fields.cards) {
            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{ overflow: 'hidden' }}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                        </div>
                        <div style={{ overflow: 'auto', overflowY: 'scroll' }}>
                            <div style={{ height: 300, width: message.msg.payload.fields.cards.listValue.values.length * 270 }}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies) {
            return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values} />;
        }
    }

    renderMessages = (returnedMessages) => {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                // console.log(message.msg);
                // console.log(message.msg.text);
                // console.log(message.msg.text.text);
                return this.renderOneMessage(message, i);

            }
            )
        } else {
            return null;
        }
    };

    _handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    _handleQuickReplyPayload = (event, payload, text) => {
        event.preventDefault();
        event.stopPropagation();
        switch (payload) {
            case 'training_masterclass':
                this.df_event_query('MASTERCLASS');
                break;
            default:
                this.df_text_query(text);
                break;
        }
    }

    

    componentDidMount() {
        this.df_event_query('Welcome');
    }


    render() {
        if (this.state.showBot) {
            return (
                <div style={{ backgroundColor: "white", position: "absolute", bottom: 0, right: 0 }}>
                    <div style={{ minHeight: "40vh", width: "40vw", position: 'relative', border: '1px solid lightgray' }}>
                        {/* <div style={{ minHeight: 500, maxHeight: 500, width:400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray'}}> */}
                        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                            <Nav className="container-fluid">
                                <Navbar.Brand>Chatbot</Navbar.Brand>
                                <NavItem><Nav.Link className="ml-auto" onClick={(e) => this.hide(e)}>Close</Nav.Link></NavItem>
                            </Nav>
                        </Navbar>

                        <div id="chatbot" style={{ height: '40vh', width: '100%', overflow: 'auto' }}>
                            {this.renderMessages(this.state.messages)}
                            <div ref={(el) => { this.messagesEnd = el; }}
                                style={{ float: "left", clear: "both" }}>
                            </div>
                        </div>
                        <div
                            style={{ position: "relative", bottom: 0 }}
                        // className="col s12"
                        >
                            <input style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%' }} ref={(input) => { this.talkInput = input; }} placeholder="type a message:" onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{ backgroundColor: "white", position: "absolute", bottom: 0, right: 0 }}>
                    <div style={{ minHeight: "7vh", width: "40vw", position: true ? 'relative' : "absolute", border: '1px solid lightgray' }}>
                        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                            <Nav className="container-fluid">
                                <Navbar.Brand>Chatbot</Navbar.Brand>
                                <NavItem><Nav.Link className="ml-auto" onClick={(e) => this.show(e)}>Show</Nav.Link></NavItem>
                            </Nav>
                        </Navbar>
                        <div ref={(el) => { this.messagesEnd = el; }}
                            style={{ float: "left", clear: "both" }}>
                        </div>


                    </div>
                </div>
            );
        }
    }
}

export default Chatbot;