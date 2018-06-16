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

/**
 * utility function. stringifies JSON data but not circular references
 * @param  {object} o object that could have circular references
 * @return {string}   stringified representation of json without the circular refs
 */
const logCircularObject = o => {
  // Demo: Circular reference
  // var o = {};
  // o.o = o;

  // Note: cache should not be re-used by repeated calls to JSON.stringify.
  var cache = [];
  let result = JSON.stringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
              // Duplicate reference found
              try {
                  // If this value does not reference a parent it can be deduped
                  return JSON.parse(JSON.stringify(value));
              } catch (error) {
                  // discard key if value cannot be deduped
                  return;
              }
          }
          // Store value in our collection
          cache.push(value);
      }
      return value;
  });
  cache = null; // Enable garbage collection
  return result;
};

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
  _handleKeyDown = async e => {
    let latestDigit = e.key;
    if (latestDigit == ' ') {
      this.setState( prevState => {
        return {
          input: '',
          currentDigits: '',
          prevText: `${prevState.prevText} ${prevState.currentWord}`,
          currentText: '',
          currentWord: '',
          currentPredictions: [],
          currentPredictionsIndex: 0
        }
      }
      );
    }
    // breaks out of _handleKeyDown if the last key pressed was spacebar. or any other non numerical key.
    if(isNaN(parseInt(latestDigit))) return;

    await this._handleChange(latestDigit);
    await this._handleCurDigits(latestDigit)

    // call t9 algorith to predict word
    if (this.state.currentDigits.length > 0) {
      const curPredicts = await this._callPredict(this.state.currentDigits)
      this.setState({
        currentPredictions: curPredicts
      });
    }
    // if there are predictions for the digits we've typed, show the first one
    if(this.state.currentPredictions && this.state.currentPredictions.length > 0) {
      // 'this.state.currentPredictions[0]' our best guess right now for the word currently being typed (haven't hit space)
      this.setState({ currentWord: this.state.currentPredictions[0] });
    } else {
      // If no matches, concat latest digit typed to the end of current word
     this.setState( prevState => ({
         currentWord: `${prevState.currentWord}${latestDigit}`
       })
     );
    }
  }

  _handleChange = (val) => {
    this.setState({ input: val });
  };
  _handleCurDigits = (val) => {
    this.setState( prevState => {
      return {currentDigits: prevState.currentDigits + val}
    });
  };
  /**
   * class method that calls api
   * @param  {string} cw string of numbers to be input in algorithm
   * @return {array}    array of word predictions
   */
  _callPredict = cw => {
    const fetchURL = `http://localhost:3000/${cw}`;
    return fetch(fetchURL, { method: 'get' })
    .then(res => res.json() )
    .then(wordArray => {
      return wordArray;
    }).catch(err => {
      (err);
    });
  }

  render() {
    let { input, prevText, currentDigits, currentText, currentWord, currentPredictions, currentPredictionsIndex } = this.state;
    let textToDisplay = `${prevText} ${currentWord}`;
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
                  value={textToDisplay}
                  onKeyDown={this._handleKeyDown}
                  type="text"
                  id="inputId"
                  placeholder='Input your message in digits, T9 style here...'
                />

                <div className='poorman-textbox' name="" id="" cols="30" rows="10">
                  <span className="prev-text">prevText = {prevText}</span>
                  <span className="current-text">currentText = {currentText}</span>
                  <span className="current-digits">currentDigits = {currentDigits}</span>
                  <span className="current-word">currentWord = {currentWord}</span>
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
