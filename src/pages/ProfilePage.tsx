import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AuthForm from "../components/AuthForm";
import PersonalAccount from "../components/PersonalAccount";

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    
    return <div>{user ? <PersonalAccount user={user} /> : <AuthForm />}</div>;
};

export default ProfilePage;
