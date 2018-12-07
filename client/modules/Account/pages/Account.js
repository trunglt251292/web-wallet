import React from 'react';
import { connect } from 'react-redux';
import mnemonic from 'bitcore-mnemonic';
import classNames from 'classnames';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import FileDownload from '@material-ui/icons/FileDownload';
import ContentCopy from '@material-ui/icons/ContentCopy';
import Tooltip from '@material-ui/core/Tooltip';
import Checked from '@material-ui/icons/Check';
import Error from '@material-ui/icons/Error';
import Copy from 'copy-to-clipboard';
import NumberFormat from 'react-number-format';
import Transactions from '../components/Transactions';
import Send from '../components/Send';
import Delegate from '../components/Delegate';
import Vote from '../components/Votes';
import SecondPassphrase from '../components/SecondPassphrase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
// Import Actions
import {
  loginPassphrase,
  changePeer,
  fetchDataAccount,
  fetchBalanceAccount
} from '../AccountActions';
import {
  getAddress,
  getHostActive,
  getIps,
  getHostStatus,
  getBalance,
  getSecondSignature,
} from '../AccountReducer';
import config from '../../../../server/config';

const styles = theme => ({
  root: {
    minHeight: '350px'
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  paperChild: {
    textAlign: 'center',
  },
  address: {
    color: '#fff',
    padding: '3px',
    background: '#5f696e',
    fontWeight: 'bold',
    wordBreak: 'break-all',
  },
  addressBox: {
    textAlign: 'center',
  },
  balance: {
    color: '#fff',
    padding: '3px',
    background: '#5f696e',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectPeer: {
    fontSize: '150%',
  },
  button: {
    margin: theme.spacing.unit,
  },
  note:{
    padding: '10px',
    backgroundColor: '#ebcccc',
    marginBottom: '20px',
  },
});

class Account extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      msg: '',
      open: false,
      vertical: 'bottom',
      horizontal: 'center',
      address : '',
      warning: false,
      hostActive: '',
      ips: [],
      hostStatus: false,
      isLogin: true,
      balance: 0,
      unBalance: 0,
      transactionType: 'transmit',
      showPass: false,
      inputType: 'password',
      secondSignature: 0
    }
    this.handleLoginPassphrase = this.handleLoginPassphrase.bind(this);
    this.handleChangePeer = this.handleChangePeer.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleIsLogin = this.handleIsLogin.bind(this);
    this.handleChangeTransactionType = this.handleChangeTransactionType.bind(this);
    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
  }
  componentWillReceiveProps(props){
    if(props.address !== this.props.address){
      this.setState({
        address: props.address
      });
    }
    if(props.hostActive !== this.props.hostActive){
      this.setState({
        hostActive: props.hostActive
      });
    }
    if(props.hostStatus !== this.props.hostStatus){
      this.setState({
        hostStatus: props.hostStatus
      });
    }
    if(props.balance !== this.props.balance){
      this.setState({
        balance: props.balance/100000000
      });
    }
    if(JSON.stringify(props.ips) !== JSON.stringify(this.props.ips)){
      this.setState({
        ips: props.ips
      });
    }
    if(JSON.stringify(props.secondSignature) !== JSON.stringify(this.props.secondSignature)){
      this.setState({
        secondSignature: props.secondSignature
      });
    }
  }
  handleChangeTransactionType = (event, value) => {
    this.setState({
      transactionType: value,
    });
  };
  handleDownload(){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.passphrase));
    element.setAttribute('download', 'passphrase.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  handleChangeShowpass = event => {
    this.setState({ showPass: event.target.checked });
    if(event.target.checked){
      this.setState({
        inputType: 'text'
      })
    } else {
      this.setState({
        inputType: 'password'
      })
    }
  };
  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.timerCheckStatus);
  }
  componentDidMount() {
    if (document.readyState === 'complete') {
      NProgress.progressDone();
    }
    // this.timerID = setInterval(
    //   () => this.initAccount(),
    //   5000
    // );
    // if(this.state.hostActive){
    //   this.timerCheckStatus = setInterval(
    //     () => this.props.dispatch(changePeer(this.state.hostActive)),
    //     10000
    //   );
    // }
  }
  handleCopy = () =>{
    Copy(this.props.address);
    this.setState({
      open: true,
      msg: 'Copied address to clipboard',
    })
  };
  handleCopyClipboard(){
    Copy(this.state.passphrase);
    this.setState({
      open: true,
      msg: 'Copied passphrase to clipboard',
    })
  };
  handleShowMessage(data){
    this.initAccount();
    this.setState({
      open: true,
      classes: data.type,
      msg: data.message,
    })
  };
  initAccount(){
    if(this.state.address){
      this.props.dispatch(fetchDataAccount());
      this.props.dispatch(fetchBalanceAccount());
    }
  }
  fix(v) {
    return (v || '').replace(/ +/g, ' ').trim().toLowerCase();
  }
  handleCreateAccount() {
    this.setState({
      isLogin: false
    });
    let passphrase = new mnemonic().toString();
    this.setState({ passphrase: passphrase });
  }
  handleIsLogin(){
    this.setState({ isLogin: true });
  }
  handleLoginPassphrase() {
    if (this.state.warning) {
      return;
    }
    this.props.dispatch(loginPassphrase(this.state.passphrase)).then(res => {
      this.initAccount()
    });
  }
  handleChangePeer = event => {
    this.setState({
      hostActive: event.target.value
    })
    this.props.dispatch(changePeer(event.target.value));
  }
  checkPassphrase = (event) => {
    let value = event.target.value;
    value = this.fix(value)
    if (value === '') {
      this.setState({
        warning: true
      });
    } else if (value.split(' ').length < 12 || !mnemonic.isValid(value)) {
      this.setState({
        warning: true
      });
    } else {
      this.setState({
        passphrase: value,
        warning: false
      });
    }
  }
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open } = this.state;
    console.log(this.state);
    return (
      <div className={classes.root}>
      <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          classes={{root: this.state.classes && this.state.classes === 'warning' ? 'root-override-error' : 'root-override-success'}}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.msg}</span>}
        />
        {this.state.address ? (
          <Grid container className={classes.root} spacing={24}>
            <Grid item xs={12}>
              <Paper style={{textAlign: 'center'}} className={classes.paper}>
                <h4 className={classes.paperChild}>Address</h4>
                <Tooltip placement="top" id="tooltip-copy" title="Copy address">
                  <Button aria-label="Copy address" onClick={this.handleCopy}>
                  <ContentCopy className={classNames(classes.leftIcon, classes.iconSmall)} />
                    <span style={{ textTransform: 'none' }}>{this.state.address}</span>
                  </Button>
                </Tooltip>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.paperChild}>
              <Paper className={classes.paper}>
                <h4>Peers
                  <span style={{
                    float: 'right'
                  }}>
                    {this.props.hostStatus ? (
                      <Checked style={{
                        color: '#73c8a9'
                      }}/>
                    ) : (
                      <Error  style={{
                        color: 'red'
                      }}/>
                    )}
                  </span>
                </h4>
                <Select
                  value={this.state.hostActive}
                  className={classes.selectPeer}
                  onChange={this.handleChangePeer}
                >
                  {this.state.ips.map((ip, index) => {
                    return (
                      <MenuItem key={index} value={ip}>{ip}</MenuItem>
                    )
                  })}
                </Select>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.paperChild}>
              <Paper className={classes.paper}>
                <h4>Balance
                  <span style={{
                    float: 'right'
                  }}>
                    <a href={`${config.explorerLink}#/wallets/${this.props.address}`} target="_blank">Explorer</a>
                  </span>
                </h4>
                <h3><span className={classes.balance}>
                  <NumberFormat
                    value={this.state.balance}
                    displayType={'text'}
                    thousandSeparator={true}
                    decimalScale={5}
                    suffix={' KN'}/>
                  </span></h3>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Tabs style={{overflowX: 'auto'}}
                    value={this.state.transactionType}
                    onChange={this.handleChangeTransactionType}
                    indicatorColor="primary"
                    textColor="primary"
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
              >
                <Tab disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Transmit funds" value="transmit" />
                {!this.state.secondSignature &&
                <Tab disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Second passphrase" value="passphrase" /> }
                <Tab disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Vote delegates" value="vote" />
                <Tab disableRipple
                  classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label="Delegate" value="delegate" />
              </Tabs>
              {this.state.transactionType === 'transmit' ?
                <Send handleShowMessage={this.handleShowMessage} /> :
                this.state.transactionType === 'passphrase' ?
                  <SecondPassphrase handleShowMessage={this.handleShowMessage} /> :
                this.state.transactionType === 'vote' ?
                  <Vote handleShowMessage={this.handleShowMessage} /> :
                  <Delegate handleShowMessage={this.handleShowMessage} />
              }
            </Grid>
            <Grid item xs={12}>
              <Transactions />
            </Grid>
          </Grid>
        ) : (
          <Grid container className={classes.root} spacing={24}>
            <Grid style={{ maxWidth: '700px', margin: '0 auto', marginTop: '100px' }} item xs={12}>
              {this.state.isLogin ? (
                <Paper className={classes.paper}>
                  <h2 className={classes.paperChild}>Login account</h2>
                    <TextField
                      label="Enter your passphrase"
                      helperText={this.state.warningText}
                      onChange={this.checkPassphrase}
                      type={this.state.inputType}
                      fullWidth={true}
                      error={this.state.warning}
                    />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.showPass}
                        onChange={this.handleChangeShowpass}
                        color="primary"
                      />
                    }
                    label="Show passphrase"
                  />
                    <br />
                    <br />
                    <div className={classes.paperChild}>
                      <Button color="primary"
                      onClick={this.handleCreateAccount}>New account</Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button variant="raised"
                              color="primary"
                              disabled={this.state.warning}
                              onClick={this.handleLoginPassphrase}>Login</Button>
                   </div>
                </Paper>
              ) : (
                <Paper className={classes.paper}>
                  <h2 className={classes.paperChild}>Passphrase </h2>
                  <Paper className={classes.note}>
                    This is your passphare. <b className='note-new'>Please store carefully.</b> Make sure that you keep the passphrase safe. After, click button "NEXT" to login.
                  </Paper>
                  <TextField
                    label="Passphrase"
                    fullWidth={true}
                    value={this.state.passphrase ? this.state.passphrase : ''}
                  />
                  <br />
                  <br />
                  <div className={classes.paperChild}>
                    <Tooltip id="tooltip-fab" title="Copy passphrase to Clipboard">
                      <IconButton color="secondary" onClick={this.handleCopyClipboard} className={classes.button} aria-label="Copy passphrase to Clipboard">
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip id="tooltip-fab" title="Download passphrase">
                      <IconButton className={classes.button} onClick={this.handleDownload} aria-label="Download passphrase" color="primary">
                        <FileDownload />
                      </IconButton>
                    </Tooltip>
                    <Button color='primary'
                            onClick={this.handleCreateAccount}> Generate new passphrase </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button variant='raised' color='primary'
                      onClick={this.handleIsLogin}> Next </Button>
                 </div>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
       </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    address: getAddress(state),
    hostActive: getHostActive(state),
    ips: getIps(state),
    hostStatus: getHostStatus(state),
    balance: getBalance(state),
    secondSignature: getSecondSignature(state),
  };
}
export default withStyles(styles)(connect(mapStateToProps)(Account));
