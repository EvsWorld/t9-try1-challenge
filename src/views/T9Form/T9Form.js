import React from 'react';
import * as R from 'ramda';

import './T9Form.css'

import {
  Container, Row, Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardImg,
  CardFooter,
  FormGroup, FormFeedback,
  Label,
  Input,
  Button
} from 'reactstrap';


class T9Form extends React.Component {
  state = {
    input: '',
    currentDigits: '',
    currentText: '',
    prevText: '',
    currentWord: '',
    currentPredictions: [],
    currentPredictionsIndex: 0
  }

  _handleChange = (val, input) => {
    return this.setState(
      { input: val }, () =>
    console.log(`hit _handleChange with param val = ${val}. this.state.input = ${input}`)
    )
  };
  _handleCurDigits = (input) => {
    console.log(`hit _handleCurDigits !!`);
    this.setState( prevState => {
      currentDigits: prevState.currentDigits + input
    },
    () => console.log(`this.state after setState currentDigits = `, this.state)
    )
  };

  _update = async e => {
    console.log(`hit _update!!!!!`);
    let { input, currentDigits, prevText, currentText, currentWord, currentPredictions, currentPredictionsIndex } = this.state;
    let { value } = e.target;

    /**
    * If no matches, add digit typed to the end of current word
    * @type {function}
    */
    const updateCurrentDigits2 = (prevState) => {
      // console.log(`prevState.currentText + value = `, prevState.currentText + value);
      // console.log(`prevState = `, prevState);
      return R.evolve({
        currentDigits: prevState.currentDigits + input
      }, prevState );
    }

    if (e.nativeEvent.keyCode === 32) {
      // const updatePrevText = R.over({ prevText: `${prevText} ${currentText} ` })
      console.log('hit the spacebar!!');
      console.log(`this.state = `, this.state);
      this.setState( prevState => (
        {
          input: '',
          currentDigits: '',
          prevText: prevState.currentText,
          currentText: '',
          currentWord: '',
          currentPredictions: [],
          currentPredictionsIndex: 0
        }
      ));
    }
    // Don't do anything if number isn't input
    if(isNaN(parseInt(value))) return;

    // const updateCurrentDigits = R.evolve({ currentDigits : ()=> currentDigits + input })
    console.log( `value = `, value);
    await this._handleChange(value, input);
    await this._handleCurDigits(input)

   console.log('currentDigits = ', currentDigits );
    if (currentDigits.length > 0) {
      const curPredicts = await this._callPredict(currentDigits)
     this.setState({
        currentPredictions: curPredicts
      });
      console.log(`this.state = `, this.state);
    }
    console.log(`currentPredictions = `, currentPredictions);
    // if there are predictions for the digits we've typed, show the first one

    if(currentPredictions && currentPredictions.length > 0) {
      // This is our best guess right now for the word currently being typed (haven't hit space)
      this.setState(R.evolve({ currentWord: currentPredictions[0] }));
      console.log(`this.state.currentPredictions = `, this.state.currentPredictions);
    }
    // else {
    //   // just tack the number typed on the end bc we have to do this again
    //   this.setState(updateCurrentDigits2);
    //   console.log(`this.state = `, this.state);
    //
    // }

  }

  _callPredict = cw => {
    console.log('callPredict was called!', 'cw = ', cw);
    const fetchURL = `http://localhost:3000/${cw}`;

    fetch(fetchURL, { method: 'get' })
    .then(res => res.json() )
    .then(wordArray => {
      console.log(`response wordArray = `, wordArray);
      return wordArray;
      // this.setState({currentPredictions: wordArray})
    }).catch(err => {
      (err);
    });
  }


  render() {
    let { input, prevText, currentDigits, currentText, currentWord, currentPredictions, currentPredictionsIndex } = this.state;
    // let textToDisplay = `${prevText} ${currentDigits}`;
    return (
      <div>
        <Col xs="12" sm="6">
          <Card>
            <CardHeader>
              Card Header
              {/* <strong>Validation feedback</strong> Form */}
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label htmlFor="inputId">Type your numbers here...</Label>
                <Input
                  name="input"
                  value={input}
                  onChange={this._update}
                  onKeyUp={this._update}
                  type="text"
                  id="inputId"
                  placeholder='Input your message in digits, T9 style here...'
                />

                <div className='poorman-textbox' name="" id="" cols="30" rows="10">
                  <span className="prev-text">prevText = {prevText}</span>
                  <span className="current-text">currentText = {currentText}</span>
                  <span className="current-digits">currentDigits = {currentDigits}</span>
                  <span className="cursor">|</span>
                </div>
                {/* <CardFooter>
                  <Button
                    onChange={this._handleChange}
                    size='md'
                    color='primary'
                    type='submit'

                    />
                </CardFooter> */}
                {/* <FormFeedback>Houston, we have a problem...</FormFeedback> */}
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </div>
    );
  }
}

export default T9Form;
