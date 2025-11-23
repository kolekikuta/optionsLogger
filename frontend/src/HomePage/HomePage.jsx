import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './HomePage.css'

export default function HomePage() {

    return (
        <PanelGroup direction="vertical" style={{ width: '100vw', height: '100vh' }}>
            <Panel defaultSize={50}>
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={70} className="panel">
                        <h1>Chart</h1>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={30} className="panel">
                        <h1>New Log</h1>

                    </Panel>
                </PanelGroup>
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={50} className="panel">
                <h1>Logs</h1>
            </Panel>

        </PanelGroup>
    )
}