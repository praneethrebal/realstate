import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginUserForm from "./components/LoginUserForm";
import Layout from "./components/Layout";

import Dashboard from "./components/Dashboard";
import PaymentPage from "./components/PaymentPage";
import AddProperty from "./components/AddProperty";
import SingeleCategorie from "./components/categories/SingeleCategorie";
import SingleProperty from "./components/categories/SingleProperty";
import ProtectedRoute from "./hooks/ProtectedRoute";
import "./App.css";
import CompanyProfilePage from "./components/Profile/CompanyProfile";
import WinnerAnnouncement from "./components/forms/WinnerAnnouncement";
import ProfilePage from "./components/Profile/ProfilePage";
import ReelsViewer from "./components/reels/ReelsViewer";
import UserRegisterForm from "./components/regetrationForms/UserRegisterForm";
import Saved from "./components/categories/Saved";
import PickersAndMoversForm from "./components/forms/PickersAndMoversForm";
import BuildWithConfidence from "./components/forms/BuildWithConfidence";
import LoanApplicationForm from "./components/forms/LoanApplicationForm";
import MyRequirementsForm from "./components/forms/MyRequirementsForm";
import EmiCalculatorForm from "./components/forms/EmiCalculatorForm";
import FranchiseMain from "./components/franchise/FranchiseMain";
import AddForms from "./components/company/Addforms";
import PostReel from "./components/reels/PostReel";
import Profile from "./components/Profile/Profile";
import FranchiseMapSection from "./components/franchise/FranchiseMapSection";
import FranchiseFormSection from "./components/franchise/FranchiseFormSection";
import OwnersSection from "./components/franchise/OwnersSection";
import AllProjectsPage from "./components/listings/AllProjectsPage";
import CompanyRegisterForm from "./components/regetrationForms/CompanyRegetrationForm";
import SingleProject from "./components/categories/SingleProject";
import AllCompaniesPage from "./components/listings/AllCompaniesPage";
import FranchiseRegisterForm from "./components/regetrationForms/FranchiseRegisterForm";
import FranchiseProfile from "./components/Profile/FranchiseProfile/";
import ContactUsForm from "./components/forms/ContactUsForm";
import LotteryPage from "./components/categories/LotteryPage";
import LotteryPageDetails from "./components/categories/LotteryDetailsPage";
import CreateLotteryForm from "./components/forms/CreateLotteryForm";
import TermsAndConditions from "./components/categories/TermsAndConditions";
import LotteryTerms from "./components/categories/LotteryTerms";
import Policy from "./components/categories/PrivacyPolicy";
import BuyLotteryForm from "./components/forms/BuyLotteryForm";
import MobileViewSearch from "./components/MobileViewSearch";
import LotteryVerificationPage from "./components/LotteryVerificationPage";
import AllProfilesPage from "./components/listings/AllProfilesPage";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/contact-us/:id" element={<ContactUsForm />} />
          <Route path="/" element={<Dashboard />} />{" "}
          {/* Dashboard has its own Layout */}
          <Route
            path="/all-profiles"
            element={
              <Layout>
                <AllProfilesPage />
              </Layout>
            }
          />
          <Route path="/login/user" element={<LoginUserForm />} />
          <Route path="/register/user" element={<UserRegisterForm />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route
            path="/all-companies"
            element={
              <Layout>
                <AllCompaniesPage />
              </Layout>
            }
          />
          <Route
            path="/franchiseReg"
            element={
              <Layout>
                <FranchiseRegisterForm />
              </Layout>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/LotteryTerms" element={<LotteryTerms />} />
          <Route path="/Policy" element={<Policy />} />
          <Route
            path="/FranchiseProfile"
            element={
              <Layout>
                <FranchiseProfile />
              </Layout>
            }
          />
          <Route
            path="/LotteryPageDetails/:id"
            element={
              <Layout>
                <LotteryPageDetails />
              </Layout>
            }
          />
          <Route path="/search" element={<MobileViewSearch />} />
          <Route
            path="/winnerAnnouncement"
            element={
              <Layout>
                <WinnerAnnouncement />
              </Layout>
            }
          />
          <Route
            path="/buy-lottery/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <BuyLotteryForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createLotteryForm"
            element={
              <Layout>
                <CreateLotteryForm />
              </Layout>
            }
          />
          <Route
            path="/addProperty"
            element={
              <Layout>
                <ProtectedRoute>
                  <AddProperty />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route path="/companyRegister" element={<CompanyRegisterForm />} />
          <Route
            path="/singleProperty/:propId"
            element={
              <Layout>
                <ProtectedRoute>
                  <SingleProperty />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/lottery"
            element={
              <Layout>
                <LotteryPage />
              </Layout>
            }
          />
          <Route
            path="/singleProject/:propId"
            element={
              <Layout>
                <ProtectedRoute>
                  <SingleProject />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/admin/lotteryVerificationPage/adminacess"
            element={<LotteryVerificationPage />}
          />
          <Route
            path="/categorie/:categorieName/:location"
            element={
              <Layout>
                <ProtectedRoute>
                  <SingeleCategorie />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/categorie/:categorieName"
            element={
              <Layout>
                <ProtectedRoute>
                  <SingeleCategorie />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route path="newUser" element={<UserRegisterForm />} />
          <Route
            path="/profilePage"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
          <Route path="reelsView" element={<ReelsViewer />} />
          <Route
            path="/saved"
            element={
              <Layout>
                <Saved />
              </Layout>
            }
          />
          <Route
            path="/pickers-and-movers"
            element={
              <Layout>
                <PickersAndMoversForm />
              </Layout>
            }
          />
          <Route
            path="/build-with-confidence"
            element={
              <Layout>
                <BuildWithConfidence />
              </Layout>
            }
          />
          <Route
            path="/loan-application"
            element={
              <ProtectedRoute>
                <Layout>
                  <LoanApplicationForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requirements"
            element={
              <Layout>
                <MyRequirementsForm />
              </Layout>
            }
          />
          <Route
            path="/emi-calculator"
            element={
              <Layout>
                <EmiCalculatorForm />
              </Layout>
            }
          />
          <Route
            path="/add-project"
            element={
              <Layout>
                <AddForms />
              </Layout>
            }
          />
          <Route
            path="/add-reel"
            element={
              <Layout>
                <PostReel />
              </Layout>
            }
          />
          <Route
            path="/franchise/details"
            element={
              <>
                <Layout>
                  <FranchiseMapSection />
                  <OwnersSection />
                  <FranchiseFormSection />
                </Layout>
              </>
            }
          />
          <Route
            path="/companyprofile"
            element={
              <Layout>
                <CompanyProfilePage />
              </Layout>
            }
          />
          <Route
            path="/companyprofile/:userId/"
            element={
              <Layout>
                <CompanyProfilePage />
              </Layout>
            }
          />
          <Route
            path="/all-projects"
            element={
              <Layout>
                <AllProjectsPage />
              </Layout>
            }
          />
          <Route
            path="/franchise"
            element={
              <Layout>
                <FranchiseMain />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
