import React, { Component } from "react";
import Input from "@material-ui/core/Input";
import styled from "@emotion/styled";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Send";
import { graphql, compose } from "react-apollo";
import TextField from "@material-ui/core/TextField";

import { CenterPage, Card } from "../../components";
import mutation from "../../graphql/login";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

const Logo = styled("div")`
  font-weight: 700;
  font-size: 28px;
  color: ${p => p.theme.colors.white};
`;
const Text = styled('div')`
  color: ${p => p.theme.colors.white};
  font-size: ${p=>p.theme.text.medium};
  margin: 20px 10px;
`;
const ButtonBox = styled("div")`
  margin-top: 20px;
  margin-bottom: 10px;
`;
const Message = styled("div")`
  margin-top: 15px;
  color: ${p => p.theme.colors.white};
`;
const Content = styled("div")`
  margin-top: auto;
  margin-bottom: auto;
  
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      sent: false
    };
  }

  onSubmit = async e => {
    e.preventDefault();
    const { mutate } = this.props;
    const { email } = this.state;

    console.log(`Login with ${this.state.email}`);
    const result = await mutate({ variables: { input: { email } } });
    console.log(result);
    if (!result) return false;
    const { data = {} } = result;
    const { emailSent } = data.login || {};
    if (emailSent) {
      this.setState({ sent: true });
    }
  };

  onChange = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    console.log(this.props);
    const { sent } = this.state;
    const { classes } = this.props;
    return (
      <CenterPage login height={"100vh"}>
        <Card minHeight="400px" maxWidth="300px">
          <Content>
              <Logo>Login to NerdCentral</Logo>
              <Text>
                enter your email and we will send a link to login
              </Text>
              <form action="">
                <TextField
                  placeholder="email"
                  name={"email"}
                  variant="outlined"
                  onChange={e => this.onChange(e)}
                  className={classes.textField}
                />
                <ButtonBox>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={e => this.onSubmit(e)}
                  >
                    Send The Links
                    <SaveIcon />
                  </Button>
                </ButtonBox>
              </form>
              {sent && <Message>Email Sent: Check Your Inbox</Message>}
          </Content>
        </Card>
      </CenterPage>
    );
  }
}

export default compose(
  graphql(mutation),
  withStyles(styles)
)(Login);
