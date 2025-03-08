import react,{useState} from 'react'
import { useDispatch,useSelector } from "react-redux";
import { Container, Row, Col, Image } from 'react-bootstrap';
import UserIconPlaceholder from '../../components/UserIconPlaceholder'
import {useChangePasswordMutation,useUpdateAddressMutation} from '../../redux/api/userApiSlice.js'
import { setCredentials } from "../../redux/features/auth/authSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import {toast} from "react-toastify"
//modals
import ChangePasswordModal from '../../components/ChangePasswordModal';
import ChangeAddressModal from '../../components/ChangeAddressModal.jsx';

const btnStyle = {
    width:"80%",
    marginLeft: "30px",
    border:"none",
}

function Profile(){
    const dispatch = useDispatch();
    const [changePassword,{passwordError}] = useChangePasswordMutation();
    const [updateAddress,{addressError}] = useUpdateAddressMutation();
    const {userInfo} = useSelector((state)=>state.auth);
    const {name,email,isAdmin,address} = userInfo?.data || null;

    //passwordModal
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
                dispatch(setCredentials(response));
                toast.success("Password Changed Successfully!");
            }
        }catch(err){
                toast.error(err.data.message || "Unexpected Error Occurred!")
        }
    };
    //address Modal
    const [showAddressChangeModal,setShowAddressChangeModal] = useState(false);
    function toggleAddressModal(){
        setShowAddressChangeModal(prev=>!prev);
    }
    async function handleChangeAddress(address){
        try{
            const result = await updateAddress({
                ...userInfo.data,
                address
            }).unwrap()
            if(result){
                dispatch(setCredentials(result));
                toast.success(result.message);
            }
        }catch(error){
            toast.error(error.message)
        }

    }
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
                    <h1 className="mt-3">Name: {name ? name : "John Doe"}</h1>
                    <p className="text-light">Email: {email}</p>
                </Col>
                <Col xs={6} md={6} lg={4}>
                    <fieldset className='border m-8 p-8 d-flex flex-column justify-content-around' style={{height:"300px"}}>
                    <legend className='d-block'>
                        <FontAwesomeIcon className='mx-2' icon={faCog}/>
                        Setting
                    </legend>
                            <button style={btnStyle} onClick={togglePasswordModal}>Change Password</button>
                            <button style={btnStyle}>Check History</button>
                            <button style={btnStyle} onClick={toggleAddressModal}>Change Address</button>
                    </fieldset>
                
                </Col>
            </Row>
            <Row>
            </Row>
        <ChangePasswordModal show={showPasswordChangeModal} onHide={togglePasswordModal} onConfirm={handleChangePassword} />
        <ChangeAddressModal show={showAddressChangeModal} onHide={toggleAddressModal} onConfirm={handleChangeAddress} existingAddress={address}/>
        </Container>
    )
}

export default Profile;