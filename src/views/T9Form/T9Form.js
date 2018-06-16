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
  _handleKeyDown = e => {
    console.log(`hit _handleKeyDown!!!!! 'Object.keys(e)' = ${Object.keys(e)}`);
    console.log(`hit _handleKeyDown!!!!! 'e.key' = ${logCircularObject(e.key)}\n
    e.nativeEvent = ${logCircularObject(e.nativeEvent)}\n
    e.nativeEvent.keyCode = ${e.nativeEvent.keyCode} `);
    if (e.key == ' ') {
      // const updatePrevText = R.over({ prevText: `${prevText} ${currentText} ` })
      console.log('\n\n\nhit the spacebar!!');
      console.log(`this.state = `, this.state);
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
      }, () => console.log(`this.state after spacebar = `, this.state)
      );
    }
    this._triggerChange(e);
  }
  _handleChange = (val) => {
    console.log(`hit _handleChange with param val = ${val}.`);
    this.setState(
      { input: [...val].pop() }, () =>
    console.log(`this.state.input (after _handleChange setState()) = ${this.state.input}`)
    )
  };
  _handleCurDigits = () => {
    console.log(`hit _handleCurDigits !!`);
    this.setState( prevState => {
      return {currentDigits: prevState.currentDigits + this.state.input}
    },
    () => console.log(`this.state after setState currentDigits = `, this.state)
    )
  };
  _triggerChange = async e => {
    // e.preventDefault();
    console.log(`hit _triggerChange!!!!! 'Object.keys(e)' = ${Object.keys(e)} \n
    e.key = ${e.key} `);
    let { input, currentDigits, prevText, currentText, currentWord, currentPredictions, currentPredictionsIndex } = this.state;
    let latestDigit = e.key;
    /**
    * If no matches, add digit typed to the end of current word
    * @type {function}
    */
    const updateCurrentDigits2 = (prevState) => {
      // console.log(`prevState = `, prevState);
      return R.evolve({
        currentDigits: prevState.currentDigits + input
      }, prevState );
    }

    // Don't do anything if number isn't input
    if(isNaN(parseInt(latestDigit))) {
      console.log(`latestDigit = `, latestDigit);
      return;
    }
    // const updateCurrentDigits = R.evolve({ currentDigits : ()=> currentDigits + input })
    console.log( `latestDigit (before calling _handleChange) = `, latestDigit);
    await this._handleChange(latestDigit);
    // await this.props.onChange(latestDigit);
    await this._handleCurDigits(latestDigit)

  // call t9 algorith to predict word
   console.log('currentDigits = ', this.state.currentDigits );
   console.log(`typeof currentDigits = `, typeof this.state.currentDigits);
    if (this.state.currentDigits.length > 0) {
      const curPredicts = await this._callPredict(this.state.currentDigits)
      console.log('curPredicts = ', curPredicts);
      this.setState({
        currentPredictions: curPredicts
      }, () => console.log(`this.state.currentPredictions = `, this.state.currentPredictions));
      console.log(`this.state = `, this.state);
    }
    console.log(`this.state.currentPredictions = `, this.state.currentPredictions);
    // if there are predictions for the digits we've typed, show the first one

    if(this.state.currentPredictions && this.state.currentPredictions.length > 0) {
      // This is our best guess right now for the word currently being typed (haven't hit space)
      this.setState({ currentWord: this.state.currentPredictions[0] }, () =>
      console.log(`this.state.currentWord = `, this.state.currentWord)
      );
    }
    // else {
    //   // just tack the number typed on the end bc we have to do this again
    //   this.setState(updateCurrentDigits2);
    //   console.log(`this.state = `, this.state);
    // }
  }
  _callPredict = cw => {
    console.log('callPredict was called!', 'cw = ', cw);
    const fetchURL = `http://localhost:3000/${cw}`;

    return fetch(fetchURL, { method: 'get' })
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
                  // onChange={this._handleChange}
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
