import React from "react";
import graphql from 'babel-plugin-relay/macro';
import {createFragmentContainer} from 'react-relay';
import RepositoryCommit from './RepositoryCommit'

function RepositoryCommits({repository}) {
    window.repository = repository
    return (

        <div>
            <h2>RepositoryCommits</h2>
            <p>number of commits: {repository.commitComments.totalCount}</p>
            <table className="commitList">
                <thead>
                <tr>
                    <td>comment</td>
                    <td>author</td>
                    <td>updatedAt</td>
                </tr>
                </thead>
                <tbody>
                    {repository.commitComments.edges.map(edge => {
                        return (
                            <RepositoryCommit key={edge.node.id} commitComment={edge.node}/>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default createFragmentContainer(RepositoryCommits, {
    repository: graphql`
        fragment RepositoryCommits_repository on Repository{
            commitComments(last:3) @connection(key: "RepositoryCommits_commitComments") {
                totalCount
                edges {
                    node {
                        id
                        ...RepositoryCommit_commitComment
                    }
                }
            }
        }
    `
})