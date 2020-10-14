import React from "react";
import graphql from 'babel-plugin-relay/macro';
import {createPaginationContainer} from 'react-relay';
import RepositoryCommit from './RepositoryCommit'

function RepositoryCommits({repository,relay}) {
    const _loadMore = () => {
        if (!relay.hasMore()) {
            console.log('nothing more to load')
            return;
        }else if(relay.isLoading()){
            console.log('request is already pending')
            return;
        }

        relay.loadMore(
            2,  // Fetch the next 10 feed items
            error => {
                console.log('loadMore error!')
                console.log(error);
            },
        );
    }
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
            <div>
                {/*{repository.commitComments.edges.map(edge => {*/}
                {/*    return (*/}
                {/*        <div key={edge.node.id}>{edge.node.id} | {edge.node.updatedAt}</div>*/}
                {/*    )*/}
                {/*})}*/}
                <button onClick={() => _loadMore()}>Load More</button>
            </div>
        </div>
    )
}

export default createPaginationContainer(RepositoryCommits, {
        repository: graphql`
            fragment RepositoryCommits_repository on Repository
            @argumentDefinitions(
                count: {type: "Int", defaultValue: 3}
                cursor: {type: "String"}
            ) {
                repositoryID: id
                commitComments(
                    first: $count
                    after: $cursor
                ) @connection(key: "RepositoryCommits_commitComments") {
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                    totalCount
                    edges {
                        node {
                            id
                            updatedAt
                            ...RepositoryCommit_commitComment
                        }
                    }
                }
            }
        `
    },
    {
        direction: 'forward',
        getConnectionFromProps(props) {
            return props.repository && props.repository.commitComments;
        },
        // This is also the default implementation of `getFragmentVariables` if it isn't provided.
        getFragmentVariables(prevVars, totalCount) {
            return {
                ...prevVars,
                count: totalCount,
            };
        },
        getVariables(props, secondArgument, fragmentVariables) {
            const {count, cursor} = secondArgument
            console.log('getVariables: props',props)
            console.log('getVariables: secondArgument',secondArgument)
            console.log('getVariables: fragmentVariables',fragmentVariables)
            return {
                count,
                cursor,
                // userID isn't specified as an @argument for the fragment, but it should be a variable available for the fragment under the query root.
                repositoryID: props.repository.repositoryID,
            };
        },
        query: graphql`
            # Pagination query to be fetched upon calling 'loadMore'.
            # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
            query RepositoryCommitsPaginationQuery(
                $count: Int!
                $cursor: String
                $repositoryID: ID!
            ) {
                repository: node(id: $repositoryID) {
                    ...RepositoryCommits_repository @arguments(count: $count, cursor: $cursor,)
                }
            }
        `
    }
)