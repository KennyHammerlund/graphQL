import { gql } from "apollo-boost";

export default gql`
mutation loginMutation($input: LoginInput!){
  login(input: $input){
    token
    emailSent
  }
}
`;
