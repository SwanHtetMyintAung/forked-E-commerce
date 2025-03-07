import react,{useState} from 'react'
import { useSelector } from "react-redux";
import { Container, Row, Col, Image } from 'react-bootstrap';
import UserIconPlaceholder from '../../components/UserIconPlaceholder'
import {useChangePasswordMutation} from '../../redux/api/userApiSlice.js'
import {toast} from "react-toastify"
//modals
import ChangePasswordModal from '../../components/ChangePasswordModal';

function Profile(){
    const [changePassword,error] = useChangePasswordMutation();
    let passwordChangeErrorMessage = "";
    const {userInfo} = useSelector((state)=>state.auth);
    const {name,email,isAdmin} = userInfo?.data;
    const [showPasswordChangeModal,setShowPasswordChangeModal] = useState(false);
    const imageUrl=""

    function togglePasswordModal(){
        setShowPasswordChangeModal(prev=>!prev);
    }
    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        const userData = {
            ...userInfo.data,
            password: currentPassword,
            newPassword,
        };
        try{
            const response = await changePassword(userData).unwrap();
            if(response){
                toast.success("Password Changed Successfully!");
            }
        }catch(err){
                toast.error(err.data.message || "Unexpected Error Occurred!")
        }
    };
    return(
        <Container className="mx-auto text-light mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4} className="text-center mb-3 mb-md-0">
                    <div className='d-flex justify-content-center'>
                    {imageUrl ? (
                        <Image src={imageUrl} roundedCircle fluid style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                    ) : (
                        <UserIconPlaceholder width="150px" height="150px" />
                    )}
                    </div>
                </Col>
                <Col xs={6} md={6} lg={4}>
                    <h1 className="mt-3">Name: {name ? name : "John Doe"}</h1>
                    <p className="text-light">Email: {email}</p>
                
                </Col>
            </Row>
            <Row>
            <fieldset className='border m-8 p-8 d-flex flex-column justify-content-around' style={{height:"300px"}}>
            <legend className='d-block'>Setting</legend>
                    <button onClick={togglePasswordModal}>Change Password</button>
                    <button>Check History</button>
                    <button>Change Address</button>
             </fieldset>
            </Row>
        <ChangePasswordModal show={showPasswordChangeModal} onHide={togglePasswordModal} onConfirm={handleChangePassword} />
        </Container>
    )
}

export default Profile;