import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter} from "react-router-dom";
import Login from "../../pages/auth/Login";
import { AuthProvider } from "../../context/AuthContext";
import api from "../../api/axios";

//Mocking the API module
vi.mock("../../api/axios", () => ({
  default: {
    post: vi.fn(),
    interceptors: {
        request: {use: vi.fn()},
        response: {use: vi.fn()},
    },
  },
}));

//Helper to render Login with all its required providers
const renderLogin = () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("should render the login form", () => {
        renderLogin();
        expect(screen.getByText("DungeonScribe")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeDefined();
        expect(screen.getByLabelText("Password")).toBeDefined();
        expect(screen.getByRole("button", {name: "Sign In"})).toBeInTheDocument();
    })

    it("should show error message on failed login", async () => {
        //Arrange - make the API call reject with an error
        api.post.mockRejectedValueOnce(new Error("Invalid credentials"));

        renderLogin();

        //Act - fill in the form and submit
        await userEvent.type(
            screen.getByLabelText("Email"),
            "wrong@test.com"
        )
        await userEvent.type(
            screen.getByLabelText("Password"),
            "wrongpassword"
        )
        await userEvent.click(screen.getByRole("button", {name: "Sign In"}))

        //Assert - check that the error message is displayed
        expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    })

it('should disable submit button while loading', async () => {
  // Arrange - make API call hang indefinitely
  api.post.mockImplementationOnce(() => new Promise(() => {}))

  renderLogin()

  // Get reference to button BEFORE clicking
  const submitButton = screen.getByRole('button', { name: 'Sign In' })

  await userEvent.type(screen.getByLabelText('Email'), 'test@test.com')
  await userEvent.type(screen.getByLabelText('Password'), 'password123')
  await userEvent.click(submitButton)

  // Assert - button should now show loading state and be disabled
  expect(screen.getByRole('button', { name: 'Signing In...' }))
    .toBeDisabled()
})

    it("should have a link to the register page", () => {
        renderLogin();

    expect(screen.getByRole('link', {name: 'Register'})).toBeInTheDocument();
    })

})