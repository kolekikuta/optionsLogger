import { useEffect, useContext } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './HomePage.css'
import CreateLog from '../../components/CreateLog/CreateLog';
import { LogoutButton } from '@/components/LogoutButton';
import PositionsTable from '@/components/PositionsTable/PositionsTable';
import Charts from '@/components/Charts/Charts';
import Header from '@/components/Header/Header';
import { PositionsRefreshContext } from '@/layouts/DashboardLayout';


export default function HomePage() {
    const { refreshKey, setRefreshKey } = useContext(PositionsRefreshContext);

    return (
        <>
            <div className="px-8">
            <Charts />
            <PositionsTable refreshKey={refreshKey} setRefreshKey={setRefreshKey}/>
            </div>
        </>
    )
}