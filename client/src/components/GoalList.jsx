import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goalRef, userListRef } from '../firebase';
import { setGoals, setUsers } from '../actions';
import GoalItem from './GoalItem';
import Pagination from './Pagination';
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
      todayString: moment(new Date()).format('DD MMMM YYYY'),
      status: '',
      pressed: false,
      orderBy: undefined,
      orderAsc: false,
      goalslist: [],
      pageOfItems: []
    };
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.searchToday = this.searchToday.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.searchType1 = this.searchType1.bind(this);
    this.searchType2 = this.searchType2.bind(this);
    this.sortByStatus = this.sortByStatus.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
  }

  componentDidMount() {
    goalRef.on('value', snap => {
      let goals = [];
      snap.forEach(goal => {
        const { creator, title, assigned, description, status, attached, message, created, priority, category } = goal.val();
        const serverKey = goal.key;
        goals.push({ creator, title, assigned, description, status, attached, message, created, priority, category, serverKey });
      })
      this.props.setGoals(goals);
      this.setState({goalslist: goals.reverse()});
      // this.changePage();
    });
    userListRef.on('value', snap => {
      let users = [];
      snap.forEach(user => {
        const { email, name, avatar, rights } = user.val();
        users.push({ email, name, avatar, rights });
      })
      this.props.setUsers(users);
    })
  }

  sort(a, b) {
    const index = this.state.orderBy;
    if (index === 1) {
      return (this.state.orderAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    } else if (index === 2) {
      return (this.state.orderAsc ? a.creator.localeCompare(b.creator) : b.creator.localeCompare(a.creator));
    } else if (index === 3) {
      return (this.state.orderAsc ? a.created.localeCompare(b.created) : b.created.localeCompare(a.created));
    } else if (index === 4) {
      return (this.state.orderAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
    } else if (index === 5) {
      return (this.state.orderAsc ? a.priority.localeCompare(b.priority) : b.priority.localeCompare(a.priority));
    } else if (index === 6) {
      return (this.state.orderAsc ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category));
    } else return a = b;
  }

  handleClick(index) {
    this.setState({
      orderBy: index,
      orderAsc: (this.state.orderBy === index) ? !this.state.orderAsc : this.state.orderAsc
    });
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
    let dates = [startDate.format('DD MMMM YYYY')];
    for ( let i = 0; i < count; i++) {
      dates.push(startDate.add(1, 'days').format('DD MMMM YYYY'));
    }
    // dates = [...dates, [this.state.startDate.add(1, 'days').format('LL')]];
    // dates.push(this.state.startDate.add(1, 'days').format('LL'));
    console.log('dates', dates);
    console.log('moment', moment().subtract(4, 'days').format('DD MMMM YYYY г. HH:mm'));
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
    });
  }

  searchType1(event) {
    this.setState({searchBy: 'title', searchPlaceholder: 'Введите название'});
  }

  searchType2(event) {
    this.setState({searchBy: 'creator', searchPlaceholder: 'Введите email автора'});
  }

  onChangePage(pageOfItems) {
      // update state with new page of items
      this.setState({pageOfItems: pageOfItems});
  }

  render() {
    const headers = ["","Название","Создал(а)","Дата создания","Статус","Приоритет","Категория","Действие"];
    // console.log('this.props.goals', this.props.goals);
    let goalslist = (this.state.orderBy === undefined) ? this.state.pageOfItems : this.state.pageOfItems.sort(this.sort.bind(this)),
        searchString = this.state.searchString.trim().toLowerCase(),
        todaySearchString = this.state.todayString.trim().toLowerCase(),
        status = this.state.status.trim().toLowerCase(),
        searchBy = this.state.searchBy;

    // goalslist = goalslist.slice(0, 10);

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
              {
                headers.map((header, index) => {
                  const isSelected = (index === this.state.orderBy);
                  const arrow = (isSelected ? (this.state.orderAsc ? "is--asc" : "is--desc") : "");
                  const classes = `${isSelected ? `is--active ${arrow}` : ""}`
                  return (<th className={classes} key={index} onClick={this.handleClick.bind(this, index)}>{header}</th>);
                })
              }
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
        <Pagination items={this.state.goalslist} onChangePage={this.onChangePage} />
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
