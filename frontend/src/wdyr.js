import React from "react"
import whyDidYouRender from "@welldone-software/why-did-you-render"

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  })
}
