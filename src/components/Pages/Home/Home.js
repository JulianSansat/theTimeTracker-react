import React, { Component } from 'react';
import Api from "../../../services/api";
import AsyncSelect from 'react-select/lib/Async';
import moment from 'moment';
import './Home.scss';

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            logs: [],
            errorWarning: 'hide',
            selectedUser: '',
            year: '',
            month: '',
            day: '',
            days: [],
            logFilters: [],
            maxYearsFilter: 3
        }
    }

    componentDidMount() {
        Api.get(`/logs`)
        .then(res => {
          if(res.status === 200){
            this.setState({
              'errorWarning': 'hide',
              'logs': res.data.data
            });
          }
        })
        .catch(error => {
          if(error.response != undefined){
            this.setState(
              {
                'errorWarning': '',
                'errors': error.response.data.errors
              }
            );
            return;
          }
          this.setState(
            {
              'errorWarning': ''
            }
          );
        });
    }

    handleUserSelectChange = (selectedUser) => {
      this.setState({ selectedUser });
      this.filterLogs('user_id', selectedUser.user_id);
    }

    handleDateSelectChange = (e) => {
      this.setState({[e.target.name]: e.target.value});
      if(e.target.name === 'month' && e.target.value !== ''){
        let month = moment().month(e.target.value).format("MM");
        let numberOfDays = moment(this.state.year+'-'+month, "YYYY-MM").daysInMonth()
        let days = [];
        for (var i = 1; i <= numberOfDays; i++) {
            days.push(i);
        }
        this.setState({
          days: days
        })
      }
      if(e.target.name === 'month' && e.target.value === ''){
        this.setState({
          days: []
        })
      }
      let date = '2018-01-01 00:00:00';
      let year = this.state.year;
      let month = this.state.month !== '' ? moment().month(this.state.month).format("MM") : '01';
      let day = this.state.day !== '' ? this.state.day : '01';

      if(e.target.name === 'year'){
        year = e.target.value;
        this.filterLogs('year', year);
      }

      if(e.target.name === 'month'){
        month = e.target.value !== '' ? moment().month(e.target.value).format("M") : '';
        this.filterLogs('month', month);
      }

      if(e.target.name === 'day'){
        day = e.target.value !== '' ? moment().day(e.target.value).format("DD") : '';
        this.filterLogs('day', day);
      }

      date = year+'-'+month+'-'+day+' 00:00:00';


      if(e.target.name === 'date'){
        if(moment(date).isValid()){
          this.filterLogs('date', date);
        }
      }
    }

    filterLogs = (key, value) => {
      let logFilters = this.state.logFilters;
      logFilters[key] = value;
      this.setState({
        logFilters: logFilters
      });
      this.loadLogs(logFilters);
    }

    loadLogs = (filters) => {
      Api.get(`/logs`, {params: {...filters}})
        .then(res => {
        if(res.status === 200){
          this.setState({
            'errorWarning': 'hide',
            'logs': res.data.data
          });
        }
        })
        .catch(error => {
          if(error.response != undefined){
            this.setState(
              {
                'errorWarning': '',
                'errors': error.response.data.errors
              }
            );
            return;
          }
          this.setState(
            {
              'errorWarning': ''
            }
          );
        });
    }

    render() {

        const lastYears = [];
        for (var i = 0; i < this.state.maxYearsFilter; i++) {
            lastYears.push(moment().subtract(i, 'y').format('YYYY'));
        }

        const months = moment.months();

        const promiseOptions = inputValue => {
          return Api.get(`/users`, {params:{first_name: inputValue}}).then(res => {
            return res.data.data.map(obj => {
              return {value: obj.id, label: obj.first_name + ' ' + obj.last_name  , user_id:obj.id};
            });
          });
        };

        return (
            <section className="section">
                <div className="columns">
                  <div className="column">
                    <div class="field">
                      <label class="label" for="userSelect">User</label>
                      <div class="control">
                        <AsyncSelect
                          cacheOptions={true}
                          value={this.state.selectedUser}
                          onChange={this.handleUserSelectChange}
                          defaultOptions={true}
                          loadOptions={promiseOptions}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div class="field">
                      <label class="label" for="year">Year</label>
                      <div class="control">
                        <div className="select">
                          <select name="year" onChange={this.handleDateSelectChange}>
                            <option value=''></option>
                            {lastYears.map((year) => 
                              <option value={year}>{year}</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div class="field">
                      <label class="label" for="month">Month</label>
                      <div class="control">
                        <div className="select">
                          <select name="month" onChange={this.handleDateSelectChange}>
                            <option value=''></option>
                            {months.map((month) => 
                              <option value={month}>{month}</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div class="field">
                      <label class="label" for="day">Day</label>
                      <div class="control">
                        <div className="select">
                          <select name="day" onChange={this.handleDateSelectChange}>
                            <option value=''></option>
                            {this.state.days.map((day) => 
                              <option value={day}>{day}</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                
                <div className="box">
                    <article class={"message is-danger " + this.state.errorWarning}>
                      <div class="message-header">
                        <p>Failed to load logs</p>
                      </div>
                      <div class="message-body">
                        <p>something went wrong when accessing time logs</p>
                      </div>
                    </article>
                    <table className="table is-narrow is-fullwidth is-bordered">
                        <thead className="thead">
                            <tr>
                                <th>User</th>
                                <th>Logged Time</th>
                                <th>Session start</th>
                                <th>Session end</th>
                            </tr>
                        </thead>
                        <tbody>
                          {Object.values(this.state.logs).map(log => 
                            <tr key={log.id}>
                              <th>{log.user.first_name} {log.user.last_name}</th>
                              <td>{log.time}</td>
                              <td>{moment(log.start).format('MMMM Do YYYY, h:mm:ss a')}</td>
                              <td>{moment(log.finish).format('MMMM Do YYYY, h:mm:ss a')}</td>
                            </tr>
                          )}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
}

export default Home;