import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function FilterRow(props) {
    return (
            <Row onClick={() => props.supportFilter()} className={props.firstcss}>
                <span className={props.secondcss}>
                    <img
                        src={require('../../Assets/Img/'+props.imgname+'.svg')}
                        alt="new"
                    />
                </span>
                <span className={props.thirdcss}>{props.label}</span>
            </Row>
    );
}
