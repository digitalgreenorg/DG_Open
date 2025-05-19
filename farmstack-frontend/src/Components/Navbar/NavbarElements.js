import { FaBars } from 'react-icons/fa';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
background: #ffffff;
height: 70px;
padding-top: 25px;
display: flex;
justify-content: space-between;
border: 1px solid #F1F1F1;
// padding: 0.1rem calc((100vw - 1000px) / 2);
padding: 0px 70px;
z-index: 12;
/* Third Nav */
/* justify-content: flex-start; */
vertical-align: middle;
`;

export const NavLink = styled(Link)`
color: #808080;
display: flex;
align-items: center;
text-decoration: none;
margin-left: 29px;
/*margin-bottom: -5px;*/
/*margin-top: 25px;*/
margin-right: 29px;
padding: 0px;
/* height: 100%; */
cursor: pointer;
&.active {
	border-bottom: 8px solid #c09507;
	margin-bottom: 5px;
	margin-top: 10px;
	color: #3D4A52;

}
&.active > .boldimage {
	display: block;s
}
&.active > .nonboldimage {
	display: none;
}
&:hover {
    text-decoration: none;
    color: #A3B0B8;
}
&.active:hover {
	color: #3D4A52;
}

font-family: 'Open Sans';
font-style: normal;
font-weight: 600;
font-size: 14px;
line-height: 138.69%;
/* or 19px */

/* headings */
color: #A3B0B8;

`;

export const Bars = styled(FaBars)`
display: none;
color: #808080;
@media screen and (max-width: 768px) {
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	transform: translate(-100%, 75%);
	font-size: 1.8rem;
	cursor: pointer;
}
`;

export const NavMenu = styled.div`
display: flex;
align-items: center;
// margin-right: -24px;
/* Second Nav */
/* margin-right: 24px; */
/* Third Nav */
white-space: wrap;
@media screen and (max-width: 768px) {
	display: none;
}
`;

export const NavBtn = styled.nav`
display: flex;
align-items: center;
margin-right: 0px;
white-space: wrap;
justify-content: flex-end;
/* Third Nav */
@media screen and (max-width: 768px) {
	display: none;
}
`;

export const NavBtnLink = styled(Link)`
display: flex;
background: #ffffff;
padding: 5px 35px;
color: #c09507;
outline: none;
border: 2px solid #D8AF28;
border-radius: 2px;
cursor: pointer;
transition: all 0.2s ease-in-out;
text-decoration: none;
/* Second Nav */
margin-left: 24px;
&:hover {
	/*transition: all 0.2s ease-in-out;
	background: #fff;
    color: #808080;*/
	color: #D8AF28;
    text-decoration: none;
}

font-family: 'Open Sans';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 138.69%;
/* or 19px */
color: #D8AF28;
`;
