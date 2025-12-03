import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './HomePage.css'
import CreateLog from '../../components/CreateLog/CreateLog';


export default function HomePage() {

    return (
        <PanelGroup direction="vertical" style={{ width: '100vw', height: '100vh' }}>
            <Panel defaultSize={50}>
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={70} className="panel">
                        <div className="panel-container">
                            <h1>Chart</h1>
                        </div>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={30} className="panel">
                        <div className="panel-container">
                            <h2>New Log</h2>
                            <CreateLog />
                        </div>
                    </Panel>
                </PanelGroup>
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={50} className="panel">
                <div className="panel-container">
                    <h1>Logs</h1>
                </div>
            </Panel>

        </PanelGroup>
    )
}