import React, { useState, useEffect } from 'react';
import UrlConstants from '../../Constants/UrlConstants'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './Support.css'
import Success from '../../Components/Success/Success'
import FileSaver from 'file-saver';
import ViewDataSet from '../../Components/Datasets/viewDataSet';
import Delete from '../../Components/Delete/Delete'
import labels from '../../Constants/labels';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import {GetErrorHandlingRoute} from '../../Utils/Common';
import { useHistory } from "react-router-dom";
import HTTPService from '../../Services/HTTPService'
function SampleDataSet(props) {
    var data = [
        {
            "humidity": "Rh more ( > 70)",
            "temperature": "Low (<25C)",
            "ph": "Low (<6.5)",
            "ec": "Saline (>4)",
            "oc": "Low (< 0.55)",
            "n": "Low (< 280)",
            "p": "Low (< 10)",
            "k": "Low (< 110)",
            "message": "వాతావరణంలో తేమశాతం ఎక్కువగా మరియు ఉష్ణోగ్రతలు తక్కువగా ఉన్నాయి.  ఇలాంటి సమయంలో మీ మిరప పంటలో ఆకుముడతకు కారణమయ్యే  తెల్లదోమ, తామరపురుగు మరియు ఎర్రనల్లి ఎక్కువగా పంటను ఆశిస్తాయి.  అలాగే వీటివల్ల అనేక రకాల తెగ్గుళ్ళు వ్యాప్తి చెందుతాయి.  వాటిని అరికట్టడానికి పేడ, మూత్రం, ఇంగువ ద్రావణంను ఉపయోగించాలి. ఆ తరువాత  15 రోజులుకు ఒకసారి పుల్లటి మజ్జిగను  పిచికారి చేయండి.  మీ వ్యవసాయ  భూములు ఆమ్ల స్వభావంతో కూడినవి. మీరు మిరప పంట వేసిన  నేలలో సేంద్రియ  కర్బన  శాతం తక్కువుగా ఉంది  కాబట్టి ఒక ఎకరా మిరప పంటకు  200 లీటర్ల  ద్రవజీవామృతంను నీటిపారుదల  ద్వార అందించాలి మరియు  ఆచ్చాధన  చేసుకోవాలి.  అలాగే మీ  మిరప పంటలో మొక్క ఎదుగుదలకు ఉపయోగపడే నత్రజని, బాస్వరం మరియు పొటాషియం తక్కువుగా ఉన్నాయి. ఆ పోషకాలను పెంచడానికి ఒక ఎకరాకు  2౦౦ కిలోల వేపచెక్కను వేసుకోవాలి మరియు 200 లీటర్ల ద్రవజీవామృతంను నీటిపారుదల ద్వార అలాగే   50 లీటర్ల ద్రవజీవామృతంను 100 లీటర్ల నీటిలో కలిపి పిచికారి  చేసుకోవాలి. "
        },
        {
            "humidity": "Rh more ( > 70)",
            "temperature": "Low (<25C)",
            "ph": "Low (<6.5)",
            "ec": "Saline (>4)",
            "oc": "Low (< 0.55)",
            "n": "Low (< 280)",
            "p": "Medium (11 - 24)",
            "k": "Medium (111 - 280)",
            "message": "వాతావరణంలో తేమశాతం ఎక్కువగా మరియు ఉష్ణోగ్రతలు తక్కువగా ఉన్నాయి.  ఇలాంటి సమయంలో మీ మిరప పంటలో ఆకుముడతకు కారణమయ్యే  తెల్లదోమ, తామరపురుగు మరియు ఎర్రనల్లి ఎక్కువగా పంటను ఆశిస్తాయి.  అలాగే వీటివల్ల అనేక రకాల తెగ్గుళ్ళు వ్యాప్తి చెందుతాయి.  వాటిని అరికట్టడానికి పేడ, మూత్రం, ఇంగువ ద్రావణంను ఉపయోగించాలి. ఆ తరువాత  15 రోజులుకు ఒకసారి పుల్లటి మజ్జిగను  పిచికారి చేయండి.   మీ వ్యవసాయ  భూములు ఆమ్ల స్వభావంతో కూడినవి. మీరు మిరప పంట వేసిన  నేలలో సేంద్రియ  కర్బన  శాతం తక్కువుగా ఉంది  కాబట్టి ఒక ఎకరా మిరప పంటకు  200 లీటర్ల  ద్రవజీవామృతంను నీటిపారుదల  ద్వార అందించాలి  మరియు  అచ్చాధన  చేసుకోవాలి.  అలాగే మీ మిరప పంటలో మొక్క ఎదుగుదలకు ఉపయోగపడే నత్రజని తక్కువుగా ఉంది.   ఆ పోషకాన్ని పెంచడానికి ఒక ఎకరాకు  2౦౦ కిలోల వేపచెక్కను వేసుకోవాలి మరియు 200 లీటర్ల ద్రవజీవామృతంను నీటిపారుదల ద్వార అందించాలి."
        }
    ]
    var tabelkeys = Object.keys(data[0])
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const [screenView, setscreenView] = useState(
        {
            "isDataSetFilter": false,
            "isDataSetView": true,
            "isApprove": false,
            "isApproveSuccess": false,
            "isDisapprove": false,
            "isDisapproveSuccess": false,
            "isDelete": false,
            "isDeleSuccess": false,
            "isEnable": false,
            "isEnableSuccess": false,
            "isDisable": false,
            "isDisableSuccess": false
        }
    );
    const[isLoader, setIsLoader] = useState(false)
    const history = useHistory();
    const changeView = (keyname) => {
        let tempfilterObject = { ...screenView }
        Object.keys(tempfilterObject).forEach(function (key) { if (key != keyname) { tempfilterObject[key] = false }else{tempfilterObject[key] = true} });
        setscreenView(tempfilterObject)
    }
    const loadMoreSupportList = () => {
        setIsLoader(true);
        HTTPService('POST','','', false, true).then((response) => {
            setIsLoader(false);
        }).catch((e) => {
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(e));
        });
    };
    useEffect(() => {
    }, []);
    // const downloadAttachment = (uri, name) => {
    //     FileSaver.saveAs(UrlConstants.base_url_without_slash + uri)
    // }
    return (
        <>
            {screenView.isDataSetView ? <><ViewDataSet back={() => changeView('isDataSetFilter')} rowdata={''} tabelkeys={tabelkeys} data={data}></ViewDataSet>
                <Row>
                    <span style={{ width: "700px", border: "1px solid rgba(238, 238, 238, 0.5)", height: "0px" }}></span><span className="fontweight400andfontsize14pxandcolor3D4A52">{"or"}</span><span style={{ width: "700px", border: "1px solid rgba(238, 238, 238, 0.5)", height: "0px" }}></span>
                </Row>
                <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                    <span className="mainheading">{"Request changes"}</span>
                </Row>
                <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                    {false ? <Avatar
                        src={""}
                        sx={{ width: 56, height: 56 }}
                    /> : <Avatar sx={{ bgcolor: "#c09507", width: 56, height: 56 }} aria-label="recipe">{"s"}</Avatar>}<span className="thirdmainheading" style={{ "margin-left": "8px" }}>{"sdsdfsd"}</span><span className="thirdmainheading" style={{ "margin-left": "8px" }}>{"  " + "sdsddfdfbdfbfsd"}</span>
                </Row>
                <Row style={{ "margin-left": "93px" }}>
                    <span className="thirdmainheading" style={{ "margin-left": "64px", "margin-top": "-23px" }}>{"sdsdfsd"}</span>
                </Row>
                <Row style={{ "margin-left": "93px", "margin-top": "30px" }}>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={10}
                        value={""}
                        onChange={() => { }}
                        variant="filled"
                        style={{
                            width: "93%", "margin-left": "60px",
                            "margin-right": "70px"
                        }}
                    />
                </Row></> : ''}

            {screenView.isDisable ? <Delete
                route={"login"}
                imagename={'disable'}
                firstbtntext={"Disable"}
                secondbtntext={"Cancel"}
                deleteEvent={() => { }}
                cancelEvent={() => {changeView('isDataSetView') }}
                heading={"Disable dataset"}
                imageText={"Are you sure you want to diable the dataset?"}
                firstmsg={"This action will disable the dataset from the system."}
                secondmsg={"The dataset will disappear to your members and connector will disconnect. "}>
            </Delete>
                : <></>}
            {screenView.isDisableSuccess ?
                <Success okevent={() => {changeView('isDataSetFilter') }} route={"datahub/participants"} imagename={'success'} btntext={"ok"} heading={"Dataset disabled successfully!"} imageText={"Disabled"} msg={"You diabled a dataset."}></Success> : <></>
            }
            {screenView.isEnable ? <Delete
                route={"login"}
                imagename={'disable'}
                firstbtntext={"Enable"}
                secondbtntext={"Cancel"}
                deleteEvent={() => { }}
                cancelEvent={() => { changeView('isDataSetView')}}
                heading={"Enable dataset"}
                imageText={"Are you sure you want to enable the dataset?"}
                firstmsg={"This action will enable the dataset from the system."}
                secondmsg={"The dataset will appear to your members and connector will connect."}>
            </Delete>
                : <></>}
            {screenView.isEnableSuccess ?
                <Success okevent={() => {changeView('isDataSetFilter') }} route={"datahub/participants"} imagename={'success'} btntext={"ok"} heading={"Dataset enabled successfully!"} imageText={"Enabled"} msg={"You enabled a dataset."}></Success> : <></>
            }
            {screenView.isApprove ? <Delete
                route={"login"}
                imagename={'thumbsup'}
                firstbtntext={"Approve Dataset"}
                secondbtntext={"Cancel"}
                deleteEvent={() => { }}
                cancelEvent={() => {changeView('isDataSetView') }}
                heading={"Approve Dataset"}
                imageText={"Are you sure you want to approve Dataset?"}
                firstmsg={""}
                secondmsg={""}>
            </Delete>
                : <></>}
            {screenView.isApproveSuccess ?
                <Success okevent={() => {changeView('isDataSetFilter') }} route={"datahub/participants"} imagename={'success'} btntext={"ok"} heading={"Approve Dataset"} imageText={"Approved"} msg={"You approved a dataset."}></Success> : <></>
            }
            {screenView.isDisapprove ? <Delete
                route={"login"}
                imagename={'thumbsdown'}
                firstbtntext={"Disapprove Dataset"}
                secondbtntext={"Cancel"}
                deleteEvent={() => { }}
                cancelEvent={() => { changeView('isDataSetView')}}
                heading={"Disapprove Dataset"}
                imageText={"Are you sure you want to disapprove Dataset?"}
                firstmsg={""}
                secondmsg={""}>
            </Delete>
                : <></>}
            {screenView.isDisapproveSuccess ?
                <Success okevent={() => {changeView('isDataSetFilter') }} route={"datahub/participants"} imagename={'success'} btntext={"ok"} heading={"Disapprove Dataset"} imageText={"Disapprove"} msg={"You disapproved a dataset."}></Success> : <></>
            }
            {screenView.isDelete ? <Delete
                route={"login"}
                imagename={'thumbsdown'}
                firstbtntext={"Delete"}
                secondbtntext={"Cancel"}
                deleteEvent={() => { }}
                cancelEvent={() => {changeView('isDataSetView') }}
                heading={"Delete dataset"}
                imageText={"Are you sure you want to delete your dataset?"}
                firstmsg={"This action will delete the dataset from the system."}
                secondmsg={"The dataset will no longer be able to use in your datahub account."}>
            </Delete>
                : <></>}
            {screenView.isDeleSuccess ?
                <Success okevent={() => {changeView('isDataSetFilter') }} route={"datahub/participants"} imagename={'success'} btntext={"ok"} heading={"Your dataset deleted successfully!"} imageText={"Deleted!"} msg={"You deleted a dataset."}></Success> : <></>
            }
        </>
    );
}
export default SampleDataSet;
