import React, {Component} from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import {without} from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      lastIndex: 0,
      formDisplayBool: false,
    };
    this.deleteAppointmentMethod = this.deleteAppointmentMethod.bind(this);
    this.toggleFormMethod = this.toggleFormMethod.bind(this);

  }

  toggleFormMethod() {
    this.setState({
      formDisplayBool: !this.state.formDisplayBool
    });
  }

  deleteAppointmentMethod(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({
      myAppointments: tempApts
    })
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          
          item.aptId = this.state.lastIndex; //indexing each items from the received data
          this.setState({ lastIndex: this.state.lastIndex + 1}) // this a part of line 23

          return item;
        });
        this.setState({
          myAppointments: apts
        });
      });
  }

  render() {
    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay ={this.state.formDisplayBool}
                  toggleForm={this.toggleFormMethod}
                />
                <SearchAppointments />
                <ListAppointments 
                appointments={this.state.myAppointments} // props, flowing data to the subcomponent
                deleteAppointment={this.deleteAppointmentMethod} // receiving a event from the subcomponent
                /> 
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;