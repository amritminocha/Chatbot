import React, { Component } from 'react';
import QuickReply from './QuickReply';


class QuickReplies extends Component {
    constructor(props){
         super(props);
    }

    renderQuickReply = (reply, i) => {
        return <QuickReply key={i} click={this._handleClick} reply={reply} />;
    }

    renderQuickReplies(quickReplies) {
        if (quickReplies) {
            return quickReplies.map((reply, i) => {
                    return this.renderQuickReply(reply, i);
                }
            )
        } else {
            return null;
        }
    }

    _handleClick = (event,payload,text) => {
        this.props.replyClick(event,payload,text);
    }

    render() {
        return(
            <div className="col s12 m8 offset-m2 l6 offset-l3" style={{border: "1px solid orange"}}>
                <div className="card-panel grey lighten-5 z-depth-1" style={{border: "1px solid lightgrey"}}>
                    <div className="row valign-wrapper" style={{border: "1px solid green"}}>
                        <div style={{border: "1px solid blue" ,marginRight:20}}>
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{this.props.speaks}</a>
                        </div>
                        <div id="quick-replies" style={{border: "1px solid yellow"}} className="col s10">
                            {this.props.text && <p>
                                {this.props.text.stringValue}
                            </p>
                            }
                            {this.renderQuickReplies(this.props.payload)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


 
}

export default QuickReplies;