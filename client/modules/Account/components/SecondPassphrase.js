import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import mnemonic from 'bitcore-mnemonic';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FileDownload from '@material-ui/icons/FileDownload';
import ContentCopy from '@material-ui/icons/ContentCopy';
import Autorenew from '@material-ui/icons/Autorenew';
import Tooltip from '@material-ui/core/Tooltip';
import Copy from 'copy-to-clipboard';
import Button from '@material-ui/core/Button';
import { sendTransaction } from '../AccountActions';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  paperChild: {
    textAlign: 'center',
  },
  note:{
    padding: '10px',
    backgroundColor: '#ebcccc',
    marginBottom: '20px',
  },
});
class SecondPassphrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passphrase: '',
      secondPassphrase: '',
      generalPassphrase: '',
      disabled: true,
      checkSend: false,
      showPassword: false,
      showSecondPassword: false,
      step: 0
    }
    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.handleSendTransaction = this.handleSendTransaction.bind(this);
    this.checkFormActive = this.checkFormActive.bind(this);
    this.handleCopyClipboard = this.handleCopyClipboard.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
  }
  componentDidMount(){
    this.handleCreateAccount();
  }
  handleNextStep = (step) => {
    this.setState({ step: step })
  }
  checkFormActive(){
    if(!this.state.checkPassphrase && this.state.passphrase &&
      !this.state.checkSecondPassphrase && this.state.secondPassphrase){
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
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
    } else if (value !== this.state.generalPassphrase) {
      this.setState({
        warningSecondPassphrase: 'The second passphrase does not match the one you just got.',
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
  resetForm(){
    this.setState({
      passphrase: '',
      secondPassphrase: '',
      generalPassphrase: '',
    })
  }
  handleSendTransaction() {
    if(this.state.disabled === true) return;
    this.setState({
      disabled: true
    })
    sendTransaction({
      type: 1,
      passphrase: this.state.passphrase,
      secondPassphrase: this.state.secondPassphrase
    }).then(res => {
      if(res && res.success){
        this.resetForm();
        this.props.handleShowMessage({
          type: 'success',
          message: `Success: You have registered second passphrase. Transaction ID ${res.transactionIds[0]}`
        });
      } else {
        this.props.handleShowMessage({
          type: 'warning',
          message: `Warning: ${res.error}`,
        });
        this.setState({
          disabled: false
        })
      }
    })
  }
  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleMouseDownSecondPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  handleClickShowSecondPassword = () => {
    this.setState({ showSecondPassword: !this.state.showSecondPassword });
  };

  handleDownload(){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.generalPassphrase));
    element.setAttribute('download', 'second-passphrase.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  handleCopyClipboard(){
    Copy(this.state.generalPassphrase)
    this.props.handleShowMessage({
      type: 'success',
      message: 'Copied second passphrase to Clipboard'
    })
  }
  handleCreateAccount() {
    let passphrase = new mnemonic().toString();
    this.setState({
      generalPassphrase: passphrase,
      secondPassphrase: ''
    });
  }
  render() {
    const { classes } = this.props;
    let errorPassphrase = this.state.checkPassphrase ? true : false;
    let errorSecondPassphrase = this.state.checkSecondPassphrase ? true : false;
    return (
      <Paper className={classes.paper}>
        <div>
          <h2>Register second Passphrase</h2>
          <div style={{display:this.state.step === 0 ? 'block' : 'none'}}>
            <Paper className={classes.note}>
             Please backup securely the second passphrase before continuing, this client does NOT store it and thus cannot recover your passphrase! After creating the second passphrase if you are having issues with forms (second passphrase field not showing up) please restart your client.
            </Paper>
            <TextField
              label="Passphrase"
              fullWidth={true}
              value={this.state.generalPassphrase ? this.state.generalPassphrase : ''}
            />
            <br />
            <br />
            <div className={classes.paperChild}>
              <Tooltip id="tooltip-fab" title="Copy second passphrase to Clipboard">
                <IconButton color="secondary" onClick={this.handleCopyClipboard} className={classes.button} aria-label="Copy second passphrase to Clipboard">
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip id="tooltip-fab" title="Download second passphrase">
                <IconButton className={classes.button} onClick={this.handleDownload} aria-label="Download second passphrase" color="primary">
                  <FileDownload />
                </IconButton>
              </Tooltip>
              <Tooltip id="tooltip-fab" title="General new second passphrase">
                <IconButton className={classes.button} onClick={this.handleCreateAccount} aria-label="General new second passphrase">
                  <Autorenew />
                </IconButton>
              </Tooltip>
              <Button variant="raised" color="primary"
                      onClick={() => this.handleNextStep(1)}>Continue</Button>
            </div>
          </div>
          <div style={{display:this.state.step === 1 ? 'block' : 'none'}}>
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
            <br />
            <br />
            <FormControl fullWidth error={errorSecondPassphrase}>
              <InputLabel htmlFor="adornment-password">Confirm second passphrase*</InputLabel>
              <Input
                type={this.state.showSecondPassword ? 'text' : 'password'}
                value={this.state.secondpassphrase}
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
                <Button color="primary"
                           onClick={() => this.handleNextStep(0)}>Previous</Button>
              &nbsp;&nbsp;&nbsp;
              <Button variant="raised" color="primary"
                      disabled={this.state.disabled}
                      onClick={this.handleSendTransaction}>Send</Button>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

export default  withStyles(styles)(connect()(SecondPassphrase));
