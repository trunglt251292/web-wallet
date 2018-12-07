import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import mnemonic from 'bitcore-mnemonic';
import config from '../../../../server/config';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { fetchDelegate, sendTransaction, fetchForged, fetchVotes, fetchDelegates } from '../AccountActions';
import { getSecondSignature } from '../AccountReducer';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  paperChild: {
    textAlign: 'center',
  },
});
class Delegate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      passphrase: '',
      secondPassphrase: '',
      disabled: true,
      checkSend: false,
      delegate: {},
      showPassword: false,
      showSecondPassword: false,
    }
    this.checkUsername = this.checkUsername.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.handleSendTransaction = this.handleSendTransaction.bind(this);
    this.checkFormActive = this.checkFormActive.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  componentDidMount(){
    fetchDelegate().then(res => {
      if(res && res.success){
        if(res.delegate){
          this.getForged();
          this.getVotes();
          this.getDelegates();
        }
        this.setState({
          delegate: res.delegate
        })
      }
    })
  }
  getForged(){
    fetchForged().then(res => {
      if(res && res.success){
        this.setState({
          forged: res.forged/100000000
        })
      }
    })
  }
  getVotes(){
    fetchVotes().then(res => {
      if(res && res.success){
        this.setState({
          votes: res.accounts.length
        })
      }
    })
  }
  getDelegates(){
    fetchDelegates().then(res => {
      if(res && res.success){
        this.setState({
          delegates: res.delegates
        })
      }
    })
  }
  checkFormActive(){
    if(!this.state.checkUsername &&
      !this.state.checkPassphrase &&
      this.state.username &&
      this.state.passphrase
    ){
      if(this.props.secondSignature === 1){
        if(!this.state.checkSecondPassphrase &&
          this.state.secondPassphrase){
          this.setState({
            disabled: false
          })
        } else {
          this.setState({
            disabled: true
          })
        }
      } else {
        this.setState({
          disabled: false
        })
      }
    } else {
      this.setState({
        disabled: true
      })
    }
  }
  checkUsername = (event) => {
    this.setState({
      username: event.target.value
    });
    if(!event.target.value) {
      this.setState({
        checkUsername: true,
        warningUsername: 'Required'
      }, function(){
        this.checkFormActive();
      });
    } else if(event.target.value.length > 20) {
      this.setState({
        checkUsername: true,
        warningUsername: 'Invalid'
      }, function(){
        this.checkFormActive();
      });
    }else{
      this.setState({
        checkUsername: false,
        warningUsername: ''
      }, function(){
        this.checkFormActive();
      });
    }
  }
  fix(v) {
    return (v || '').replace(/ +/g, ' ').trim().toLowerCase();
  }
  checkPassphrase = (event) => {
    let value = event.target.value;
    this.setState({
      passphrase: value
    })
    value = this.fix(value);
    if (value === '') {
      this.setState({
        warningPassphrase: 'Passphrase not null',
        checkPassphrase: true
      }, function(){
        this.checkFormActive();
      });
    } else if (value.split(' ').length < 12 || !mnemonic.isValid(value)) {
      this.setState({
        warningPassphrase: 'Passphrase is not correct',
        checkPassphrase: true
      }, function(){
        this.checkFormActive();
      });
    } else {
      this.setState({
        warningPassphrase: '',
        checkPassphrase: false
      }, function(){
        this.checkFormActive();
      });
    }
  }
  resetForm(){
    this.setState({
      username: '',
      passphrase: '',
      secondPassphrase: '',
    })
  }
  handleSendTransaction() {
    if(this.state.disabled === true) return;
    this.setState({
      disabled: true
    })
    sendTransaction({
      type: 2,
      username: this.state.username,
      passphrase: this.state.passphrase,
      secondPassphrase:  this.state.secondPassphrase
    }).then(res => {
      if(res && res.success){
        this.props.handleShowMessage({
          type: 'success',
          message: `Success:  You have registered delegate. Transaction ID ${res.transactionIds[0]}`
        });
       this.resetForm();
      } else {
        this.setState({
          disabled: false
        })
        this.props.handleShowMessage({
          type: 'warning',
          message: `Warning: ${res.error}`,
        });
      }
    })
  }
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  checkSecondPassphrase = (event) => {
    let value = event.target.value;
    this.setState({
      secondPassphrase: value
    })
    value = this.fix(value);
    if (value === '') {
      this.setState({
        warningSecondPassphrase: 'Second passphrase not null',
        checkSecondPassphrase: true
      }, function(){
        this.checkFormActive();
      });
    } else if (value.split(' ').length < 12 || !mnemonic.isValid(value)) {
      this.setState({
        warningSecondPassphrase: 'Second passphrase is not correct',
        checkSecondPassphrase: true
      }, function(){
        this.checkFormActive();
      });
    } else {
      this.setState({
        warningSecondPassphrase: '',
        checkSecondPassphrase: false
      }, function(){
        this.checkFormActive();
      });
    }
  }
  handleMouseDownSecondPassword = event => {
    event.preventDefault();
  };

  handleClickShowSecondPassword = () => {
    this.setState({ showSecondPassword: !this.state.showSecondPassword });
  };

  render() {
    const { classes } = this.props;
    let errorUsername = this.state.checkUsername ? true : false;
    let errorPassphrase = this.state.checkPassphrase ? true : false;
    let errorSecondPassphrase = this.state.checkSecondPassphrase ? true : false;
    return (
      <Paper className={classes.paper}>
        {JSON.stringify(this.state.delegate) === '{}' ?
          (<div>
            <h2>Register a delegate</h2>
            <TextField label="Username*"
                       onChange={this.checkUsername}
                       type='text'
                       fullWidth={true}
                       error={errorUsername}
                       helperText={this.state.warningUsername}
                       value={this.state.username}
            >
            </TextField><br /> <br />
              <FormControl fullWidth error={errorPassphrase}>
                <InputLabel htmlFor="adornment-password">Passphrase*</InputLabel>
                <Input
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={this.state.passphrase}
                  onChange={this.checkPassphrase}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle passphrase visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff color="primary" /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="name-error-text">{this.state.warningPassphrase}</FormHelperText>
              </FormControl>
              {this.props.secondSignature ? (
              <div>
                <FormControl fullWidth error={errorSecondPassphrase}>
                  <InputLabel htmlFor="adornment-password">Second passphrase*</InputLabel>
                  <Input
                    type={this.state.showSecondPassword ? 'text' : 'password'}
                    value={this.state.secondPassphrase}
                    onChange={this.checkSecondPassphrase}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle second passphrase visibility"
                          onClick={this.handleClickShowSecondPassword}
                          onMouseDown={this.handleMouseDownSecondPassword}
                        >
                          {this.state.showSecondPassword ? <VisibilityOff color="primary" /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="name-error-text">{this.state.warningSecondPassphrase}</FormHelperText>
                </FormControl>
              </div>) : null}
            <br />
            <br />
            <div className={classes.paperChild}>
              {this.state.success ?
                (
                  <p className="transactionSuccess">
                    {this.state.success}
                  </p>
                )
                : (
                  <p className="transactionWaring">
                    {this.state.warning}
                  </p>
                )}
              <Button variant="raised" color="primary"
                      disabled={this.state.disabled}
                      onClick={this.handleSendTransaction}>Send</Button>
            </div>
          </div>
          ) : (
            <div>
              <h2>Delegate information</h2>
              <div className="delegate-info">
                <div>
                  <span>Delegate</span>
                  <span>{this.state.delegate.username}</span>
                </div>
                <div>
                  <span>Uptime</span>
                  <span>{this.state.delegate.productivity}%</span>
                </div>
                <div>
                  <span>Rank/Status</span>
                  <span>{this.state.delegate.rate}</span>
                </div>
                <div>
                  <span>Approval</span>
                  <span>{this.state.delegate.approval}%</span>
                </div>
                <div>
                  <span>Forged</span>
                  <span>{this.state.forged} KN</span>
                </div>
                <div>
                  <span>Blocks</span>
                  <span>
                    {this.state.delegate.producedblocks} ({this.state.delegate.missedblocks} missed)&nbsp;&nbsp;
                    <a
                      target="_blank"
                      href={`${config.explorerLink}#/wallets/${this.state.delegate.address}/blocks/1`}>
                      See all
                    </a>
                  </span>
                </div>
                <div>
                  <span>Votes</span>
                  <span>
                    {this.state.delegates && this.state.delegates.length ? (
                      this.state.delegates.map(delegate => {
                        return (
                          <span key={delegate.address}>&nbsp;&nbsp;<a
                          target="_blank"
                          href={`${config.explorerLink}#/wallets/${delegate.address}`}>
                            {delegate.username}
                          </a></span>
                        )
                      })
                    ) : ''}
                  </span>
                </div>
                <div>
                  <span>Voters</span>
                  <span>
                    {this.state.votes}&nbsp;&nbsp;
                    <a
                      target="_blank"
                      href={`${config.explorerLink}#/wallets/${this.state.delegate.address}/voters/1`}>
                      See all
                    </a>
                  </span>
                </div>
              </div>
          </div>
          )}
      </Paper>
    );
  }
}
// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    secondSignature: getSecondSignature(state),
  };
}

export default  withStyles(styles)(connect(mapStateToProps)(Delegate));
