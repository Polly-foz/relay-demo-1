import React from 'react'
import {createFragmentContainer} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

const RepositoryCommit = ({commitComment})=>{
    const {body,updatedAt,url,author} = commitComment
    return (
        <tr>
            <td><a href={url}>{body}</a></td>
            <td><a href={author.url}>{author.login}</a></td>
            <td>{updatedAt}</td>
        </tr>
    )

}

export default createFragmentContainer(RepositoryCommit,{
    commitComment: graphql`
        fragment RepositoryCommit_commitComment on CommitComment{
            body
            updatedAt
            url
            author{
                login
                url
            }
        }
    `
});