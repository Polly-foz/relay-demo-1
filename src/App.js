// your-app-name/src/App.js
import React from 'react';
import './App.css';
import fetchGraphQL from './fetchGraphQL';

const {useState, useEffect} = React;

function App() {
    // We'll load the name of a repository, initially setting it to null
    const [repName, setRepName] = useState(null);
    const [viewerName, setViewerName] = useState(null);
    // When the component mounts we'll fetch a repository name
    useEffect(() => {
        console.log('isMounted')
        let isMounted = true;
        fetchGraphQL(`
            query RepositoryNameQuery {
                # feel free to change owner/name here
                repository(owner: "polly-foz" name: "Pomodoro-Timer") {
                  name
                }
                viewer{
                    login
                }
            }
    `).then(response => {
            // Avoid updating state if the component unmounted before the fetch completes
            console.log('fetch finished')
            if (!isMounted) {
                return;
            }
            const data = response.data;
            setRepName(data.repository.name);
            setViewerName(data.viewer.login)
        }).catch(error => {
            console.log('fetch error')
            console.error(error);
        });

        return () => {
            isMounted = false;
        };
    }, [fetchGraphQL]);

    // Render "Loading" until the query completes
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    {repName != null ? `Repository: ${repName}` : "Loading repository"}
                </p>
                <p>
                    {viewerName != null ? `Viewer: ${viewerName}` : "Loading viewer"}
                </p>
            </header>
        </div>
    );
}

export default App;