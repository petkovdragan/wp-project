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

//    componentDidMount() {
//        this.df_event_query('Welcome');
//    }

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

//    renderCards(cards) {
//        return cards.map((card, i) => <Card key={i} payload={card.structValue}/>);
//    }

    renderOneMessage(message, i) {
        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        } else if(message.msg && message.msg.payload.fields.cards){
            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{ overflow: 'hidden'}}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light"><i className="fa fa-robot"></i></a>
                        </div>
                        <div style={{overflow: 'auto', overflowY: 'scroll'}}>
                            <div style={{height: 300, width: message.msg.payload.fields.cards.listValue.values.length * 270}}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
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


    _handleInputKeyPress (e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
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
                                <li><a href="/" onClick={this.hide}><i className="fa fa-times"></i></a></li>
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
                <a href="#" style={{}} onClick={this.show} class="btn-floating btn-large waves-effect waves-light teal lighten-2"><i class="fa fa-comments"></i></a>
                    <div ref={(el) => { this.messagesEnd = el; }}
                            style={{ float: 'left', clear: "both"}}>
                    </div>
                </div>
            );
        }
    }
}

export default Chatbot;