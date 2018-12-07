import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
// Import Components
import Helmet from 'react-helmet';
import Header from './components/Header/Header';

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  }
});
export class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {classes} = this.props;
    return (
      <div>
        <div className={classes.root}>
          <Helmet
            title="Know Chain - ICO"
            titleTemplate="Know Chain - ICO"
            meta={[
              {charset: 'utf-8'},
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge'
              }, {
                'http-equiv': 'content-language',
                content: 'en-US'
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1 user-scalable=no'
              }
            ]}
          />
          <Header />
          <div className="container">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default withStyles(styles)(connect()(App));