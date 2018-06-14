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
    currentDigits: '',
    currentText: '',
    prevText: '',
    currentWord: '',
    currentPredictions: [],
    currentPredictionsIndex: 0
  }


  _handleChange = e => {
    let { currentDigits, prevText, currentText, currentWord, currentPredictions, currentPredictionsIndex } = this.state;
    const { value } = e.target;

    /**
    * If no matches, add digit typed to the end of current word
    * @type {function}
    */
    const updateCurrentDigits2 = (prevState) => {
      // console.log(`prevState.currentText + value = `, prevState.currentText + value);
      // console.log(`prevState = `, prevState);
      return R.evolve({
        currentDigits: prevState.currentDigits + value
      }, prevState );
    }

    if (e.nativeEvent.keyCode === 32) {
      // const updatePrevText = R.over({ prevText: `${prevText} ${currentText} ` })
      console.log('hit the spacebar!!');
      const updatePrevText = R.over(R.lensProp('prevText'),()=>currentText)
      this.setState(updatePrevText);
      currentDigits = '';
      currentWord = '';
      currentPredictions = [];
      currentPredictionsIndex = 0;
      currentText = '';

    }
    // Don't do anything if number isn't input
    if(isNaN(parseInt(value))) return;

    // const updateCurrentDigits = R.evolve({ currentDigits : ()=> currentDigits + value })
    this.setState( prevState => {
      currentDigits: prevState.currentDigits + value
    } );
    console.log(`currentPredictions = `, currentPredictions);
    if (currentDigits.length > 0) {
      currentPredictions =  this._callPredict(currentDigits);
    }
    console.log(`currentPredictions = `, currentPredictions);
    // if there are predictions for the digits we've typed, show the first one

        if(currentPredictions && currentPredictions.length > 0) {
      // This is our best guess right now for the word currently being typed (haven't hit space)
      this.setState(R.evolve({ currentWord: currentPredictions[0] }));
      console.log(`this.state.currentPredictions = `, this.state.currentPredictions);
    }
    else {
      // just tack the number typed on the end bc we have to do this again
      this.setState(updateCurrentDigits2);
      console.log(`this.state = `, this.state);

    }

  }

  _callPredict = cw => {
    console.log('callPredict was called!', 'cw = ', cw);
    const fetchURL = `http://localhost:3000/${cw}`;

    fetch(fetchURL, { method: 'get' })
    .then(res => res.json() )
    .then(wordArray => {
      console.log(`response wordArray = `, wordArray);
      this.setState({currentPredictions: wordArray})
    }).catch(err => {
      (err);
    });
  }


  render() {
    let { prevText, currentDigits, currentText, currentWord, currentPredictions, currentPredictionsIndex } = this.state;

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
                  value={`${prevText} ${currentDigits}` }
                  onChange={this._handleChange}
                  type="text"
                  id="inputId"
                  placeholder='Input your message in digits, T9 style here...'
                />

                <div className='poorman-textbox' name="" id="" cols="30" rows="10">
                  <span className="prev-text">{prevText}</span>
                  <span className="current-text">{currentText}</span>
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
