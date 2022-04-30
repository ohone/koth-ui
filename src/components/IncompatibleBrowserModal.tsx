import React from "react";
import ErrorModal from "./ErrorModal";

function IncompatibleBrowserModal(){
  return <ErrorModal 
    footer={[]} 
    title="Unsupported Browser" 
    body={`Ya browser is junk! Get metamask.`}/>
  }

export default IncompatibleBrowserModal;