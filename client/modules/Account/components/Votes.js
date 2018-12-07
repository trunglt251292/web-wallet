import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import mnemonic from 'bitcore-mnemonic';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { getSecondSignature } from '../AccountReducer';
import { fetcAllhDelegate, fetchDelegates, sendTransaction, searchDelegates } from '../AccountActions';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary,
  },
  paperChild: {
    textAlign: 'center'
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
  listItem: {
    padding: '0px'
  }
});
let delegates = [];
class Votes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passphrase: '',
      secondPassphrase: '',
      disabled: true,
      checkSend: false,
      showPassword: false,
      showSecondPassword: false,
      transactionType: 'votes',
      delegates: [],
      delegatesVote: [],
      votes: [],
      unvotes: [],
      selectedOption: '',
      checked: []
    }
    this.checkPassphrase = this.checkPassphrase.bind(this);
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.handleSendTransaction = this.handleSendTransaction.bind(this);
    this.checkFormActive = this.checkFormActive.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleChangeTransactionType = this.handleChangeTransactionType.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount(){
    let delegates = [];
    let delegatesVote = [];
    fetcAllhDelegate().then(res => {
      if(res && res.success){
        if(res.delegates.length){
          res.delegates.map(item => {
            delegates.push({
              value: item.username,
              data: item.publicKey,
              label: `${item.username} (${item.approval}% approval, ${item.productivity}% productivity)`
            })
          })
          this.setState({ delegates: delegates });
          this.delegates = delegates;
        }
      }
    })
    fetchDelegates().then(res => {
      if(res && res.success){
        if(res.delegates.length){
          res.delegates.map(item => {
            delegatesVote.push({
              value: item.username,
              data: item.publicKey,
              label: `${item.approval}% approval, ${item.productivity}% productivity`
            })
          })
          this.setState({ delegatesVote: delegatesVote })
        }
      }
    })
  }
  checkFormActive(){
      if(!this.state.checkPassphrase && this.state.passphrase && (
          this.state.votes.length || this.state.checked.length
        )
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
  fix(v) {
    return (v || '').replace(/ +/g, ' ').trim().toLowerCase();
  }
  resetForm(){
    this.setState({
      recipientAddress: '',
      amount: '',
      passphrase: '',
      secondPassphrase: '',
      votes: [],
      checked: []
    })
  }
  handleSendTransaction() {
    this.setState({
      disabled: true
    })
    if(this.state.disabled === true) return;
    let delegates = [];
    this.state.votes.map(vote => {
      delegates.push('+' + vote.data);
    })
    this.state.checked.map(vote => {
      delegates.push('-' + vote);
    })
    sendTransaction({
      type: 3,
      passphrase: this.state.passphrase,
      delegates: delegates,
      secondPassphrase: this.state.secondPassphrase
    }).then(res => {
      if(res && res.success){
        this.props.handleShowMessage({
          type: 'success',
          message: `Success: You have voted delegates. Transaction ID ${res.transactionIds[0]}`,
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

  handleChangeTransactionType = (event, value) => {
    this.setState({ transactionType: value });
  };
  handleSelectChange(value) {
    let check = false;
    this.setState(prevState => {
      let votes = [...prevState.votes];
      if(votes.length){
        votes.map((vote, index) => {
          if(vote.value === value.value){
            votes.splice(index, 1);
            check = true
          }
        })
      }
      if(!check) votes.push(value)
      return {
        votes: votes
      }
    }, function(){
      this.checkFormActive();
    });
  }
  handleInputChange(value){
    if(value === ''){
      this.setState({ delegates: this.delegates })
    } else {
      let delegates = [];
      searchDelegates({ search: value }).then(res => {
        if(res && res.success && res.delegates.length){
          res.delegates.map(item => {
            delegates.push({
              value: item.username,
              data: item.publicKey,
              label: item.username
            })
          })
          this.setState({ delegates: delegates });
        } else {
          this.setState({ delegates: [] })
        }
      })
    }
  }
  handleDelete = data => () => {
    const chipData = [...this.state.votes];
    const chipToDelete = chipData.indexOf(data);
    chipData.splice(chipToDelete, 1);
    this.setState({ votes: chipData }, function(){
      this.checkFormActive();
    });
  };
  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    }, function(){
      this.checkFormActive();
    });
  };
  render() {
    const { classes } = this.props;
    let errorPassphrase = this.state.checkPassphrase ? true : false;
    let errorSecondPassphrase = this.state.checkSecondPassphrase ? true : false;
    return (
      <Paper className={classes.paper}>
        <h2>Vote/unvote delegate</h2>
        <Tabs style={{overflowX:'auto'}}
              value={this.state.transactionType}
              onChange={this.handleChangeTransactionType}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="auto"
        >
          <Tab label="Vote delegates" value="votes"/>
          <Tab label="Unvote delegates" value="unvotes"/>
        </Tabs>
        {this.state.transactionType === 'votes' &&
        <div style={{padding: '15px 0'}}>
          {this.state.votes.length ? (
            <div style={{paddingBottom:'15px'}}>
              {
                this.state.votes.map(vote => {
                  return (
                    <Chip key={vote.value}
                          label={vote.value}
                          onDelete={this.handleDelete(vote)}
                          className={classes.chip}
                    />
                    )
                })
              }
            </div>) : null
          }
          <Select
            closeOnSelect={true}
            multi
            onChange={this.handleSelectChange}
            options={this.state.delegates}
            placeholder="Select delegates"
            removeSelected={true}
            simpleValue
            value={[]}
            onInputChange={this.handleInputChange}
          />
        </div>
        }
        {this.state.transactionType === 'unvotes' &&
        <div className={classes.paper}>
          {this.state.delegatesVote.length ? (
            <List>
              {this.state.delegatesVote.map(value => (
                <ListItem
                  key={value.data}
                  role={undefined}
                  dense
                  button
                  onClick={this.handleToggle(value.data)}
                  className={classes.listItem}
                >
                  <Checkbox
                    checked={this.state.checked.indexOf(value.data) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={value.value} secondary={value.label}/>
                </ListItem>
              ))}
            </List>) : null
          }
        </div>
        }
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

export default  withStyles(styles)(connect(mapStateToProps)(Votes));
