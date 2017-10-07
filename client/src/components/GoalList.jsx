import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goalRef, userListRef } from '../firebase';
import { setGoals, setUsers } from '../actions';
import GoalItem from './GoalItem';
import { Button, Table, InputGroup, InputGroupButton, Input, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import '../styles/GoalList.css';

class GoalList extends Component {
  constructor(props) {
    super(props);
    moment.locale('ru');
    this.state = {
      searchString: '',
      searchBy: 'title',
      searchPlaceholder: 'Введите название',
      dropdownOpen: false,
      statusDropdownOpen: false,
      startDate: moment().subtract(6, 'days'),
      endDate: moment(),
      dateRange: [],
      todayString: moment(new Date()).format('LL'),
      status: '',
      pressed: false
    };
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.searchToday = this.searchToday.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.searchType1 = this.searchType1.bind(this);
    this.searchType2 = this.searchType2.bind(this);
    this.sortByStatus = this.sortByStatus.bind(this);
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      let goals = [];
      snap.forEach(goal => {
        const { creator, title, assigned, description, status, attached, created, category } = goal.val();
        const serverKey = goal.key;
        goals.push({ creator, title, assigned, description, status, attached, created, category, serverKey });
      })
      this.props.setGoals(goals);
    });
    userListRef.on('value', snap => {
      let users = [];
      snap.forEach(user => {
        const { email, name, avatar } = user.val();
        users.push({ email, name, avatar });
      })
      this.props.setUsers(users);
    })
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date
    });
  }

  searchToday() {
    this.setState({searchBy: 'date', pressed: !this.state.pressed});
    // console.log('this.state.endDate', this.state.endDate.format('LL'));
    let startDate = moment(this.state.startDate);
    let endDate = moment(this.state.endDate);
    let count = startDate.from(endDate, true).substring(0,1);
    let dates = [startDate.format('LL')];
    for ( let i = 0; i < count; i++) {
      dates.push(startDate.add(1, 'days').format('LL'));
    }
    // dates = [...dates, [this.state.startDate.add(1, 'days').format('LL')]];
    // dates.push(this.state.startDate.add(1, 'days').format('LL'));
    console.log('dates', dates);
    // console.log('startDate', startDate.format('LL').trim().toLowerCase());
    // console.log('startDate', startDate.subtract(1, 'days').format('LL').trim().toLowerCase());
  }

  handleChange(e) {
    this.setState({searchString:e.target.value});
  }

  toggleSearch() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleStatus() {
    this.setState({
      statusDropdownOpen: !this.state.statusDropdownOpen
    });
  }

  sortByStatus(event) {
    this.setState({
      status: event.target.value,
      searchBy: 'status'
    })
  }

  searchType1(event) {
    this.setState({searchBy: 'title', searchPlaceholder: 'Введите название'});
  }

  searchType2(event) {
    this.setState({searchBy: 'creator', searchPlaceholder: 'Введите email автора'});
  }

  render() {
    // console.log('this.props.goals', this.props.goals);
    let goalslist = this.props.goals,
        searchString = this.state.searchString.trim().toLowerCase(),
        todaySearchString = this.state.todayString.trim().toLowerCase(),
        status = this.state.status.trim().toLowerCase(),
        searchBy = this.state.searchBy;

    if (searchBy === 'title') {
      if (searchString.length > 0) {
        goalslist = goalslist.filter((goal) => {
          return goal.title.toLowerCase().match( searchString );
        });
      }
    } else if (searchBy === 'creator') {
      if (searchString.length > 0) {
        goalslist = goalslist.filter((goal) => {
          return goal.creator.toLowerCase().match( searchString );
        });
      }
    } else if ((searchBy === 'date') && this.state.pressed) {
      if (todaySearchString.length > 0) {
        goalslist = goalslist.filter((goal) => {
          return goal.created.toLowerCase().match( todaySearchString );
        });
      }
    } else if (searchBy === 'status') {
      if (status.length > 0) {
        goalslist = goalslist.filter((goal) => {
          return goal.status.toLowerCase().match( status );
        });
      }
    }

    return (
      <div>
        <div className="row" style={{marginBottom: '8px'}}>
          <div className="col-lg-4 offset-lg-5">
            <div className="datepicker">
              <ButtonDropdown isOpen={this.state.statusDropdownOpen} toggle={this.toggleStatus} style={{marginRight: '10px'}}>
                <DropdownToggle color="success" outline caret>
                  Статус
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem value="Новое" onClick={(event) => this.sortByStatus(event)}>Новое</DropdownItem>
                  <DropdownItem value="Проверено" onClick={(event) => this.sortByStatus(event)}>Проверено</DropdownItem>
                  <DropdownItem value="На доработке" onClick={(event) => this.sortByStatus(event)}>На доработке</DropdownItem>
                  <DropdownItem value="В работе" onClick={(event) => this.sortByStatus(event)}>В работе</DropdownItem>
                  <DropdownItem value="Выполнено" onClick={(event) => this.sortByStatus(event)}>Выполнено</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem value="" onClick={(event) => this.sortByStatus(event)}>Все</DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
              <div>
                <Button
                  className="day-button"
                  outline
                  color="info"
                  onClick={this.searchToday}
                  style={{background: `${this.state.pressed ? '#5bc0de' : 'none'}`, color: `${this.state.pressed ? '#fff' : '#5bc0de'}`}}
                >
                  За сегодня
                </Button>
              </div>
              <DatePicker
                selected={this.state.startDate}
                selectsStart
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeStart}
                className="form-control"
              />
              -
              <DatePicker
                selected={this.state.endDate}
                selectsEnd
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeEnd}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-lg-3">
            <InputGroup>
              <Input
                value={this.state.searchString}
                type="search"
                className="form-control"
                placeholder={this.state.searchPlaceholder}
                onChange={this.handleChange.bind(this)}
              />
              <InputGroupButton>
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleSearch}>
                  <DropdownToggle caret outline color="info">
                    Поиск по
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem onClick={(event) => this.searchType1(event)}>названию</DropdownItem>
                    <DropdownItem onClick={(event) => this.searchType2(event)}>автору</DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </InputGroupButton>
            </InputGroup>
          </div>
        </div>
        <Table hover className="tasks" size="sm">
          <thead>
            <tr>
              <th></th>
              <th className="tasks__title">Название</th>
              <th>Создал</th>
              <th>Дата создания</th>
              <th>Статус</th>
              <th>Категория</th>
              <th className="tasks__edit">Действие</th>
            </tr>
          </thead>
          <tbody>
            {
              goalslist.map((goal, index) => {
                return (
                  <GoalItem key={index} goal={goal} />
                )
              })
            }
          </tbody>
        </Table>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { goals, users } = state;
  return {
    goals,
    users
  }
}

export default connect(mapStateToProps, { setGoals, setUsers })(GoalList);
