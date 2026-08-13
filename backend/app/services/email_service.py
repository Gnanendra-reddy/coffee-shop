from fastapi import BackgroundTasks

from app.core.email import (
    mail,
    MessageSchema,
    MessageType,
)

from app.core.email_tokens import (
    create_email_verification_token,
)

from app.core.password_reset import (
    create_password_reset_token,
)

def send_welcome_email(
    background_tasks: BackgroundTasks,
    email: str,
    full_name: str,
):
    message = MessageSchema(
        subject="Welcome to Coffee Shop!",
        recipients=[email],
        body=f"""
        <html>
            <body>
                <h2>Welcome, {full_name}!</h2>

                <p>
                    Your Coffee Shop account
                    has been created successfully.
                </p>

                <p>
                    We're happy to have you with us.
                </p>

                <p>
                    ☕ Coffee Shop Team
                </p>
            </body>
        </html>
        """,
        subtype=MessageType.html,
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )


def send_order_confirmation_email(
    background_tasks: BackgroundTasks,
    email: str,
    order_id: int,
    total_amount: float,
):
    message = MessageSchema(
        subject=f"Order #{order_id} Confirmed",
        recipients=[email],
        body=f"""
        <html>
            <body>
                <h2>
                    Order Confirmed!
                </h2>

                <p>
                    Thank you for your order.
                </p>

                <p>
                    Order ID:
                    <strong>#{order_id}</strong>
                </p>

                <p>
                    Total Amount:
                    <strong>
                        ₹{total_amount:.2f}
                    </strong>
                </p>

                <p>
                    Your coffee is being prepared.
                </p>

                <p>
                    ☕ Coffee Shop Team
                </p>
            </body>
        </html>
        """,
        subtype=MessageType.html,
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )


def send_payment_confirmation_email(
    background_tasks: BackgroundTasks,
    email: str,
    order_id: int,
    amount: float,
    transaction_id: str | None,
):
    message = MessageSchema(
        subject=f"Payment Successful - Order #{order_id}",
        recipients=[email],
        body=f"""
        <html>
            <body>
                <h2>
                    Payment Successful
                </h2>

                <p>
                    Your payment has been
                    successfully processed.
                </p>

                <p>
                    Order ID:
                    <strong>#{order_id}</strong>
                </p>

                <p>
                    Amount Paid:
                    <strong>
                        ₹{amount:.2f}
                    </strong>
                </p>

                <p>
                    Transaction ID:
                    <strong>
                        {transaction_id or "N/A"}
                    </strong>
                </p>

                <p>
                    Thank you for shopping with us.
                </p>

                <p>
                    ☕ Coffee Shop Team
                </p>
            </body>
        </html>
        """,
        subtype=MessageType.html,
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )


def send_verification_email(
    background_tasks: BackgroundTasks,
    email: str,
    full_name: str,
):
    token = create_email_verification_token(
        email
    )

    verification_url = (
        "http://localhost:5173/"
        f"verify-email?token={token}"
    )

    message = MessageSchema(
        subject="Verify Your Coffee Shop Email",
        recipients=[email],
        body=f"""
        <html>
            <body>
                <h2>
                    Hello {full_name}!
                </h2>

                <p>
                    Please verify your email
                    address to activate your account.
                </p>

                <p>
                    <a href="{verification_url}">
                        Verify Email
                    </a>
                </p>

                <p>
                    This link expires in 30 minutes.
                </p>

                <p>
                    ☕ Coffee Shop Team
                </p>
            </body>
        </html>
        """,
        subtype=MessageType.html,
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )

def send_password_reset_email(
    background_tasks: BackgroundTasks,
    email: str,
):
    token = create_password_reset_token(
        email
    )

    reset_url = (
        "http://localhost:5173/"
        f"reset-password?token={token}"
    )

    message = MessageSchema(
        subject="Reset Your Coffee Shop Password",
        recipients=[email],
        body=f"""
        <html>
            <body>
                <h2>
                    Password Reset
                </h2>

                <p>
                    We received a request to reset
                    your Coffee Shop password.
                </p>

                <p>
                    <a href="{reset_url}">
                        Reset Password
                    </a>
                </p>

                <p>
                    This link expires in 15 minutes.
                </p>

                <p>
                    If you didn't request this,
                    you can safely ignore this email.
                </p>
            </body>
        </html>
        """,
        subtype=MessageType.html,
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )