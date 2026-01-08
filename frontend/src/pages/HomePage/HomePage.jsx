import { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './HomePage.css'
import CreateLog from '../../components/CreateLog/CreateLog';
import { LogoutButton } from '@/components/LogoutButton';
import PositionsTable from '@/components/PositionsTable/PositionsTable';
import Charts from '@/components/Charts/Charts';
import Header from '@/components/Header/Header';


export default function HomePage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <PanelGroup direction="vertical" style={{ width: '100vw', height: '100vh' }}>
                <Panel defaultSize={50}>
                    <PanelGroup direction="horizontal">
                        <Panel defaultSize={70} className="panel">
                            <div className="panel-container">
                                <Charts />
                            </div>
                        </Panel>
                        <PanelResizeHandle />
                        <Panel defaultSize={30} className="panel">
                            <div className="panel-container">
                                <h1>?</h1>
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