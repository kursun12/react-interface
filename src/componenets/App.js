import React, {Component} from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import {findIndex, without} from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      lastIndex: 0,

      orderBy: 'petName',
      orderDir: 'asc',

      formDisplayBool: false,

      queryText: ""
    };
    this.deleteAppointmentMethod = this.deleteAppointmentMethod.bind(this);
    this.toggleFormMethod = this.toggleFormMethod.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchAptsMethod = this.searchAptsMethod.bind(this);
    this.updateInfoMethod = this.updateInfoMethod.bind(this);
  }

  searchAptsMethod(query) {
    this.setState({queryText: query});
  }

  updateInfoMethod(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id 
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts
    })
  }

  toggleFormMethod() {
    this.setState({
      formDisplayBool: !this.state.formDisplayBool
    });
  }

  changeOrder(order,dir) {
    this.setState({
      orderBy: order,
      orderDir: dir
    })
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    })
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

    let order;
    let filteredApts = this.state.myAppointments;
    
    if(this.state.orderDir === 'asc') 
    {
      order = 1;
    }
    else {
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => 
    {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase())
      {
        return -1 * order;
      }
      else 
      {
        return 1 * order;
      }
    })
    .filter(eachItem => {
      return(
        eachItem['petName'].toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName'].toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'].toLowerCase()
        .includes(this.state.queryText.toLowerCase())
      );
    })
    ;

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay ={this.state.formDisplayBool}
                  toggleForm={this.toggleFormMethod}
                  addAppointment = {this.addAppointment}
                />

                <SearchAppointments 
                orderBy={this.state.orderBy}
                orderDir={this.state.orderDir}
                changeOrder={this.changeOrder}
                searchApts={this.searchAptsMethod}
                />
                
                <ListAppointments 
                appointments={filteredApts} 
                deleteAppointment={this.deleteAppointmentMethod} // receiving a event from the subcomponent
                updateInfo={this.updateInfoMethod}
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