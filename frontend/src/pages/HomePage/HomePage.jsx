import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './HomePage.css'
import CreateLog from '../../components/CreateLog/CreateLog';
import { LogoutButton } from '@/components/LogoutButton';
import PositionsTable from '@/components/PositionsTable/PositionsTable';


export default function HomePage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <LogoutButton />
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
                                <CreateLog refreshKey={refreshKey} setRefreshKey={setRefreshKey}/>
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={50} className="panel">
                    <div className="panel-container">
                        <PositionsTable refreshKey={refreshKey} setRefreshKey={setRefreshKey}/>
                    </div>
                </Panel>

            </PanelGroup>
        </>
    )
}