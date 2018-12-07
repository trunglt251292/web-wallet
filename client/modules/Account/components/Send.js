import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import mnemonic from 'bitcore-mnemonic';
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
import { getBalance, getSecondSignature } from '../AccountReducer';
import { sendTransaction } from '../AccountActions';

const ADDRESS_VALID_RE = /^[K|k][\w]{1,33}$/
const AMOUNT_VALID_RE = /^[0-9]+(\.[0-9]{1,8})?$/
const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  paperChild: {
    textAlign: 'center',
  },
});
class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipientAddress: '',
      amount: '',
      passphrase: '',
      secondPassphrase: '',
      disabled: true,
      checkSend: false,
      showPassword: false,
      showSecondPassword: false,
    }
    this.checkRecipientAddress = this.checkRecipientAddress.bind(this);
    this.checkAmount = this.checkAmount.bind(this);
    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.handleSendTransaction = this.handleSendTransaction.bind(this);
    this.checkFormActive = this.checkFormActive.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  checkFormActive(){
    if(!this.state.checkAddressRecipient &&
      !this.state.checkAmount &&
      !this.state.checkPassphrase &&
      this.state.recipientAddress &&
      this.state.amount &&
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
  checkRecipientAddress = (event) => {
    this.setState({
      recipientAddress: event.target.value
    });
    if(!event.target.value) {
      this.setState({
        checkAddressRecipient: true,
        warningAddress: 'Required'
      }, function(){
        this.checkFormActive();
      });
    } else if(ADDRESS_VALID_RE.test(event.target.value)){
      this.setState({
        checkAddressRecipient: false,
        warningAddress: ''
      }, function(){
        this.checkFormActive();
      });
    } else {
      this.setState({
        checkAddressRecipient: true,
        warningAddress: 'Invalid'
      }, function(){
        this.checkFormActive();
      });
    }
  }
  fix(v) {
    return (v || '').replace(/ +/g, ' ').trim().toLowerCase();
  }
  resetForm(){
    this.setState({
      recipientAddress: '',
      amount: '',
      passphrase: '',
      secondPassphrase: '',
    })
  }
  handleSendTransaction() {
    this.setState({
      disabled: true
    })
    if(this.state.disabled === true) return;
    console.log('Data : ', this.state);
    sendTransaction({
      type: 0,
      recipient: this.state.recipientAddress,
      amount: this.state.amount,
      passphrase: this.state.passphrase,
      secondPassphrase: this.state.secondPassphrase
    }).then(res => {
      if(res && res.errors === null && res.data.accept.length > 0){
        this.props.handleShowMessage({
          type: 'success',
          message: `Success: You have transferred ${this.state.amount} KN. Transaction ID ${res.data.accept[0]}`
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

  checkAmount = (event) => {
    let value = event.target.value;
    this.setState({
      amount: event.target.value
    });
    if (value === '') {
      this.setState({
        warningAmount: 'Required',
        checkAmount: true
      }, function(){
        this.checkFormActive();
      });
    } else if (AMOUNT_VALID_RE.test(event.target.value) &&
      parseFloat(event.target.value) &&
      parseFloat(event.target.value) <= this.props.balance/100000000){
      this.setState({
        warningAmount: '',
        checkAmount: false
      }, function(){
        this.checkFormActive();
      });
    } else {
      this.setState({
        warningAmount: 'Insufficient funds',
        checkAmount: true
      }, function(){
        this.checkFormActive();
      });
    }
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
    let errorAddress = this.state.checkAddressRecipient ? true : false;
    let errorAmount = this.state.checkAmount ? true : false;
    let errorPassphrase = this.state.checkPassphrase ? true : false;
    let errorSecondPassphrase = this.state.checkSecondPassphrase ? true : false;
    return (
      <Paper className={classes.paper}>
        <h2>Send</h2>
        <TextField label="Recipient Address*"
                   onChange={this.checkRecipientAddress}
                   type='text'
                   fullWidth={true}
                   error={errorAddress}
                   helperText={this.state.warningAddress}
                   value={this.state.recipientAddress}
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
        <TextField label="Transaction Amount*"
                   onChange={this.checkAmount}
                   type='text'
                   fullWidth={true}
                   error={errorAmount}
                   helperText={this.state.warningAmount}
                   value={this.state.amount}
        >
        </TextField>
        <br />
        <br />
        <br />
        <br />
        <div className={classes.paperChild}>
          <Button variant="raised" color="primary"
                  disabled={this.state.disabled}
                  onClick={this.handleSendTransaction}>Send</Button>
        </div>
      </Paper>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    balance: getBalance(state),
    secondSignature: getSecondSignature(state),
  };
}

export default  withStyles(styles)(connect(mapStateToProps)(Send));
