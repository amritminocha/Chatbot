import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
const Message = (props) => {
    return (

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Container fluid>
                <Row style={{ border: "1px solid lightgray" }}>
                    {props.speaks === 'bot' &&
                        <Col lg={2}>
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                        </Col>
                    }

                    <Col lg={8} style={{ display: "flex" }}>
                        <div className="text-center" style={{ width: "100%", height: "100%", border: "1px solid lightgray" }}>
                            <h5 className="black-text" style={{textAlign: "center", justifyContent: "center", alignSelf: "center"}}>
                                {props.text}
                            </h5>
                        </div>
                    </Col>
                    {props.speaks === 'user' &&
                        <Col lg={2}>
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                        </Col>
                    }
                </Row>
            </Container>
        </div>

    );
};

export default Message;