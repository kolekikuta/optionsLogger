import LandingHero from "./LandingHero"
import LandingNav from "./LandingNav"
import LandingFeatures from "./LandingFeatures"
import LandingCTA from "./LandingCTA"

export default function LandingPage() {

    return (
        <div>
            <LandingNav/>
            <LandingHero/>
            <LandingFeatures/>
            <LandingCTA/>

        </div>

    )
}