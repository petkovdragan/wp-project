import React, { Component } from 'react';
import axios from "../custom-axios/axios";
import { withRouter } from 'react-router-dom';

import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';

const cookies = new Cookies();

class Chatbot extends Component {
    messagesEnd;
    talkInput;

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        //this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);

        this.state = {
            messages: [],
            showBot: true
        };
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    }

    async df_text_query(queryText) {
        let says = {
            speaks: "me", //koj zbore
            msg: { //poraka sto ja imame dobieno od korisnikot
                text: {
                    text: queryText
                }
            }
        }

        this.setState({messages: [...this.state.messages, says]});//trite tocki oznacuvaat site messages prethodno
        const res = await axios.post('/api/df_text_query', {text: queryText, userID: cookies.get('userID')});

        for (let msg of res.data.fulfillmentMessages) {
            says = {
                speaks: 'bot',
                msg: msg
            }
            this.setState({messages: [...this.state.messages, says]});
        }

    }

    componentDidMount() {
        let message = {
            speaks: 'bot',
            text: 'How can I help you?'
        };
        this.setState({messages: [message]})
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behaviour: "smooth"});
        if (this.talkInput){
            this.talkInput.focus();
        }
    }

    show(event) {
        event.preventDefault();//so ova se onevozmozuva na kopceto da odi na default behavior a toa e da ode na home page(u href tago e / zatoa)
        event.stopPropagation();//so ova se onevozmozuva na kopceto da odi na default behavior a toa e da ode na home page(u href tago e / zatoa)
        this.setState({showBot: true});
    }

    hide(event) {
        event.preventDefault();//so ova se onevozmozuva na kopceto da odi na default behavior a toa e da ode na home page(u href tago e / zatoa)
        event.stopPropagation();//so ova se onevozmozuva na kopceto da odi na default behavior a toa e da ode na home page(u href tago e / zatoa)
        this.setState({showBot: false});
    }

    renderOneMessage(message, i) {
        if (message.text) {
            return <Message key={i} speaks={message.speaks} text={message.text}/>;
        }
        return null;
    }


    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return this.renderOneMessage(message, i);
            });
        } else {
            return null;
        }
    }

    requestAnswer = (question) => {

        let message = {
            speaks: 'me',
            text: question
        };

        this.setState({messages: [...this.state.messages, message]}, () => {
            let body = {
                question: question,
                history: []
            };

            axios.post("/qa", body).then((response) => {

                let answer = response.data.answer;
                message = {
                    speaks: 'bot',
                    text: answer
                };
                this.setState({messages: [...this.state.messages, message]});
            });
        });
    };

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.requestAnswer(e.target.value);
            e.target.value = '';
        }
    }


    render() {
        if (this.state.showBot){
            return (
                <div style={{ height: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: "1px solid lightgrey" }}>
                    <nav>
                        <div className="nav-wrapper teal lighten-2">
                            <a href="/" className="brand-logo">Chatbot</a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.hide}><i className="fa fa-times"/></a></li>
                            </ul>
                        </div>
                    </nav>
                    < div id="chatbot" style={{height: 388, width: '100%', overflow: 'auto'}}>
                        {this.renderMessages(this.state.messages)}
                        <div ref={(el) => { this.messagesEnd = el; }}
                            style={{ float: 'left', clear: "both"}}>
                        </div>
                    </div>
                    <div className="col s12">
                        <input style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} placeholder="Type a message:" type="text" ref={(input) => { this.talkInput = input; }} onKeyPress={this._handleInputKeyPress} />
                    </div>

                </div>
            );
        } else {
            return (
                <div style={{ /*minHeight: 40, maxHeight: 500, width: 400,*/ position: 'absolute', bottom: 20, right: 20, /*1px solid lightgrey"*/ }}>
                {/* //     <nav>
                //         <div className="nav-wrapper teal lighten-2">
                //             <a href="/" className="brand-logo">Chatbot</a>
                //             <ul id="nav-mobile" className="right hide-on-med-and-down">
                //                 <li><a href="/" onClick={this.show}>Show</a></li>
                //             </ul>
                //         </div>
                //     </nav> */}
                <a href="#" style={{}} onClick={this.show} className="btn-floating btn-large waves-effect waves-light teal lighten-2"><i className="fa fa-comments"/></a>
                    <div ref={(el) => { this.messagesEnd = el; }}
                            style={{ float: 'left', clear: "both"}}>
                    </div>
                </div>
            );
        }
    }
}

export default Chatbot;