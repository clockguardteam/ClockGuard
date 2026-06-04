import os
from typing import Optional
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

load_dotenv()
GMAIL_APP_EMAIL = os.getenv("GMAIL_APP_EMAIL")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

import logging

logger = logging.getLogger(__name__)

def _mask_email(email: str) -> str:
    try:
        local, domain = email.split("@", 1)
        if not local or not domain:
            return "[redacted-email]"

        masked_local = (
            local[0] + "*" * max(len(local) - 2, 0) + local[-1]
            if len(local) > 1 else "*"
        )

        domain_parts = domain.split(".")
        domain_name = domain_parts[0]
        tld = ".".join(domain_parts[1:]) if len(domain_parts) > 1 else ""
        masked_domain_name = (
            domain_name[0] + "*" * max(len(domain_name) - 2, 0) + domain_name[-1]
            if len(domain_name) > 1 else "*"
        )

        return f"{masked_local}@{masked_domain_name}" + (f".{tld}" if tld else "")
    except Exception:
        return "[redacted-email]"

def send_payroll_email(
    employee_email: str,
    total_pay: float,
    hours: float
) -> None:
    try:
        subject = "Your Pay Period Summary"
        body = (
            f"Hello,\n\n"
            f"The pay period has ended. Here is your summary:\n\n"
            f"*  Hours Worked: {f'{hours:.2f}'}\n"
            f"*  Total Earnings (Before Taxes): ${total_pay:.2f}\n\n"
            f"Thank you."
        )

        msg = MIMEMultipart()
        msg["From"] = GMAIL_APP_EMAIL
        msg["To"] = employee_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(GMAIL_APP_EMAIL, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_APP_EMAIL, employee_email, msg.as_string())

        logger.info(f"Payroll email sent to {_mask_email(employee_email)}")

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed — check credentials")

    except smtplib.SMTPException as e:
        logger.error(f"SMTP error sending email to {_mask_email(employee_email)}: {e}")

    except Exception as e:
        logger.exception(f"Unexpected error sending email to {_mask_email(employee_email)}")

def create_response(
    success: bool,
    data = None,
    message: Optional[str] = None,
    status_code: int = 200,
    meta: Optional[dict] = None
) -> JSONResponse:
    from app.schemas import APIResponse
    
    response = APIResponse(
        success=success,
        data=data,
        message=message,
        meta=meta,
        status_code=status_code,
    )
    
    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder(response)
    )