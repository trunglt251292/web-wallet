import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-responsive-list';
import Button from '@material-ui/core/Button';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import config from '../../../../server/config';

import {
  fetchTransactionsAccount
} from '../AccountActions';
import { getAddress } from '../AccountReducer';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  totalTransaction: {
    float: 'right',
    color: '#c5c5c5',
    fontSize: '15px'
  },
  tableWrapper: {
    overflowX: 'auto',
    fontSize: '20px'
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  buttonRight: {
    float:'right'
  },
  buttonLeft: {
    float:'left'
  }
});
class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalTransaction : 0,
      transactions: [],
      value: 'all',
      waiting: false,
      current: 1
    }
    this.handleChangePage = this.handleChangePage.bind(this);
  }
  fix (value) {
    return new Date((((Date.UTC(2017,2,21,13,0,0,0) / 1000) + value) * 1000))
  }
  handleChange = (event, value) => {
    this.setState({
      value: value,
      waiting: true,
      current: 1
    }, this.initAccount(value));
  };
  initAccount(value){
    fetchTransactionsAccount(value, this.state.current).then(res => {
      if(res && res.success){
        this.setState({
          totalTransaction: res.count,
          transactions: res.transactions,
          waiting: false
        });
      }
    });
  }
  componentWillMount() {
    this.initAccount('all')
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.initAccount(this.state.value),
      5000
    );
  }
  handleChangePage = (page) => {
    this.setState({
      current: page,
      waiting: true
    }, this.initAccount(this.state.value));
  }
  convertStringToShortString(val){
   return val ?
     val.slice(0,4) + '...' + val.slice(-4)
    : ''
  }
  render() {
    const { classes } = this.props;
    const totalPage = Math.ceil(this.state.totalTransaction/config.limitList);
    const currentPage = this.state.current;
    return (
      <Paper className={classes.paper}>
        <h3>Transactions <span className={classes.totalTransaction}>{this.state.totalTransaction} {this.state.totalTransaction > 1 ? 'transactions' : 'transaction'}</span></h3>
        <Tabs style={{overflowX:'auto'}}
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
        >
          <Tab label="All" value="all" />
          <Tab label="Send" value="send" />
          <Tab label="Received" value="received" />
        </Tabs>
        {!this.state.waiting ? (
          <div className={classes.tableWrapper}>
            <Table breakPoint={700} className={classes.table}>
              <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Time</Th>
                <Th>Sender</Th>
                <Th>Recipient</Th>
                <Th>Amount (KNOW)</Th>
                <Th>Fee (KNOW)</Th>
                <Th>Confirmations</Th>
              </Tr>
              </Thead>
              <Tbody>
              {this.state.transactions.map(row => (
                <Tr className={row.recipientId === this.props.address ? "recipientCol" : "sendCol"} key={row.id}>
                  <Td><a target="_blank" href={`${config.explorerLink}#/transaction/${row.id}`}>{this.convertStringToShortString(row.id)}</a></Td>
                  <Td>{moment(new Date(this.fix(row.timestamp))).format('DD.MM.YYYY h:mm:ss')}</Td>
                  <Td><a target="_blank" href={`${config.explorerLink}#/wallets/${row.senderId}`}>{this.convertStringToShortString(row.senderId)}</a></Td>
                  <Td><a target="_blank" href={`${config.explorerLink}#/wallets/${row.recipientId}`}>{this.convertStringToShortString(row.recipientId)}</a></Td>
                  <Td className="currency">
                    <NumberFormat 
                        value={parseFloat(row.amount/100000000)} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale={5}
                        suffix={' KN'} />
                  </Td>
                  <Td className="currency">
                    <NumberFormat 
                        value={parseFloat(row.fee/100000000)} 
                        displayType={'text'} 
                        thousandSeparator={true} 
                        decimalScale={5}
                        suffix={' KN'} />
                  </Td>
                  <Td>
                    {row.confirmations > 50 ? 'Well Confirmations' : row.confirmations}
                  </Td>
                </Tr>
              ))}
              </Tbody>
            </Table>
            {currentPage > 1 &&
            <Button className={classNames(classes.button, classes.buttonLeft)}
                    variant="flat"
                    onClick={() => this.handleChangePage(currentPage - 1)}
                    size="small">
              <ArrowLeft className={classNames(classes.leftIcon, classes.iconSmall)} />
              Previous
            </Button>
            }
            { currentPage < totalPage  &&
            <Button className={classNames(classes.button, classes.buttonRight)}
                    variant="flat"
                    onClick={() => this.handleChangePage(currentPage + 1)}
                    size="small">
              Next
              <ArrowRight className={classNames(classes.rightIcon, classes.iconSmall)} />
            </Button>
            }
            </div>
        ) : <LinearProgress
          mode="indeterminate"
          style={{
            marginTop:'20px',
            backgroundColor: 'rgb(0, 188, 212)'
          }}
        />}
      </Paper>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    address: getAddress(state)
  };
}
export default  withStyles(styles)(connect(mapStateToProps)(Transactions));
