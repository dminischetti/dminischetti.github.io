from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "media" / "Dominic-Minischetti-Technology-Data-Systems.pdf"

NAVY = colors.HexColor("#102A43")
TEAL = colors.HexColor("#155E75")
INK = colors.HexColor("#172B3A")
MUTED = colors.HexColor("#526573")
LINE = colors.HexColor("#D5E0E7")
PALE = colors.HexColor("#EEF4F7")
WHITE = colors.white


def register_fonts():
    candidates = [
        (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ),
        (
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
        ),
    ]
    for regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont("ResumeSans", regular))
            pdfmetrics.registerFont(TTFont("ResumeSansBold", bold))
            return "ResumeSans", "ResumeSansBold"
    return "Helvetica", "Helvetica-Bold"


REGULAR, BOLD = register_fonts()


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.92 * inch, width, 0.92 * inch, stroke=0, fill=1)
    canvas.setFont(BOLD, 22)
    canvas.setFillColor(WHITE)
    canvas.drawString(0.62 * inch, height - 0.48 * inch, "Dominic Minischetti")
    canvas.setFont(REGULAR, 9.4)
    canvas.setFillColor(colors.HexColor("#CDE0EA"))
    canvas.drawString(0.62 * inch, height - 0.70 * inch, "TECHNOLOGY  |  DATA  |  SYSTEMS")
    canvas.setFont(REGULAR, 7.8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 0.62 * inch, 0.35 * inch, f"Dominic Minischetti  |  Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
body = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName=REGULAR,
    fontSize=9.15,
    leading=13.2,
    textColor=MUTED,
    spaceAfter=4,
)
summary = ParagraphStyle(
    "Summary",
    parent=body,
    fontSize=10.2,
    leading=15,
    textColor=INK,
)
section = ParagraphStyle(
    "Section",
    parent=styles["Heading2"],
    fontName=BOLD,
    fontSize=9,
    leading=11,
    textColor=TEAL,
    spaceBefore=7,
    spaceAfter=7,
    uppercase=True,
    tracking=1.1,
)
role = ParagraphStyle(
    "Role",
    parent=styles["Heading3"],
    fontName=BOLD,
    fontSize=10.4,
    leading=13,
    textColor=INK,
    spaceAfter=1,
)
company = ParagraphStyle(
    "Company",
    parent=body,
    fontName=BOLD,
    fontSize=8.3,
    leading=11,
    textColor=TEAL,
    spaceAfter=4,
)
meta = ParagraphStyle(
    "Meta",
    parent=body,
    fontSize=7.9,
    leading=10.5,
    textColor=MUTED,
)
contact_meta = ParagraphStyle(
    "ContactMeta",
    parent=meta,
    fontSize=7.2,
    leading=9.2,
)
strength_title = ParagraphStyle(
    "StrengthTitle",
    parent=body,
    fontName=BOLD,
    fontSize=8.5,
    leading=11,
    textColor=INK,
    spaceAfter=3,
)
strength_body = ParagraphStyle(
    "StrengthBody",
    parent=body,
    fontSize=7.9,
    leading=11.2,
)


def section_heading(text):
    return KeepTogether([
        Spacer(1, 4),
        Paragraph(text.upper(), section),
        HRFlowable(width="100%", thickness=0.7, color=LINE, spaceAfter=8),
    ])


def experience_item(title, company_text, dates, description, note=None):
    cells = [
        Paragraph(dates, meta),
        [
            Paragraph(title, role),
            Paragraph(company_text, company),
            Paragraph(description, body),
            *([Paragraph(f"<b>{note}</b>", body)] if note else []),
        ],
    ]
    table = Table([cells], colWidths=[1.12 * inch, 5.55 * inch], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return table


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.62 * inch,
        rightMargin=0.62 * inch,
        topMargin=1.08 * inch,
        bottomMargin=0.55 * inch,
        title="Dominic Minischetti - Technology, Data & Systems",
        author="Dominic Minischetti",
        subject="Professional resume",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        id="content",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=draw_page)])

    story = []
    contact = Table([[
        Paragraph("Brooklyn, New York", contact_meta),
        Paragraph("minischetti.org", contact_meta),
        Paragraph("linkedin.com/in/dminischetti", contact_meta),
        Paragraph("github.com/dminischetti", contact_meta),
    ]], colWidths=[1.45 * inch, 1.45 * inch, 2.05 * inch, 1.85 * inch])
    contact.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([contact, Spacer(1, 10)])

    story.append(Paragraph(
        "Technology professional with a background spanning data, systems, software engineering, and technical operations. "
        "Hands-on experience now informs a broader role focused on understanding problems, improving processes, coordinating work across teams, "
        "and translating technical complexity into practical solutions.",
        summary,
    ))

    story.append(section_heading("Areas of Experience"))
    strengths = [
        (
            Paragraph("Technology & Systems", strength_title),
            Paragraph("Software platforms, databases, APIs, business systems, architecture, and technical operations.", strength_body),
        ),
        (
            Paragraph("Data & Decisions", strength_title),
            Paragraph("Analysis, reporting, data quality, operational visibility, and evidence-based problem solving.", strength_body),
        ),
        (
            Paragraph("Processes & Delivery", strength_title),
            Paragraph("Requirements, workflow design, prioritization, QA/UAT, documentation, and follow-through.", strength_body),
        ),
        (
            Paragraph("Communication", strength_title),
            Paragraph("Cross-functional coordination, technical communication, mentoring, and knowledge sharing.", strength_body),
        ),
    ]
    strengths_table = Table(
        [[Table([[a], [b]], colWidths=[1.57 * inch]) for a, b in strengths]],
        colWidths=[1.70 * inch] * 4,
    )
    strengths_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(strengths_table)

    story.append(section_heading("Professional Experience"))
    story.append(experience_item(
        "Data Solution Manager",
        "Meditrial | New York",
        "2026 - Present",
        "Coordinate technology, data, and process initiatives across clinical trial platforms. Translate operational needs into clear requirements, "
        "organize follow-through across development, QA, design, clinical operations, and leadership, and use analysis to identify gaps and improve workflows.",
        "Joined Meditrial as a Backend Software Developer in March 2026 before moving into the current broader role.",
    ))
    story.append(experience_item(
        "Backend PHP Developer",
        "BLOX Digital",
        "Jul 2024 - Oct 2025",
        "Developed and optimized a large enterprise CMS serving more than 100 news organizations. Improved PHP and SQL performance, supported reliable releases, "
        "and collaborated across a distributed product and engineering environment.",
    ))
    story.append(experience_item(
        "Backend PHP Developer",
        "Appliances Connection | New York",
        "May 2022 - Mar 2024",
        "Built warehouse management workflows supporting inventory and order fulfillment. Connected business operations with backend services, handheld interfaces, "
        "and database structures designed for consistent daily use.",
    ))
    story.append(experience_item(
        "Full Stack Developer",
        "Kingsleague | Berlin",
        "Aug 2021 - May 2022",
        "Developed product features using PHP, MySQL, and Firebase. Introduced browser automation with Python and Selenium and supported Docker-based development and deployment workflows.",
    ))
    story.append(experience_item(
        "Data Analyst & Database Administrator",
        "Call2U | Italy",
        "Sep 2010 - Oct 2015",
        "Consolidated reporting systems, maintained SQL Server and MySQL environments, developed automation and Power BI dashboards, and administered server environments for more than 50 clients.",
    ))
    story.append(experience_item(
        "Web & Systems Operations",
        "ASD Servizi | Italy",
        "Dec 2006 - Apr 2008",
        "Built and maintained websites and PHP applications while managing hosting, domains, mailboxes, content, Plesk administration, and SQL databases.",
    ))

    story.append(section_heading("Education & Additional Information"))
    education_data = [[
        Paragraph(
            "<b>Bachelor of Technology, Computer Information Systems</b><br/>"
            "Database Track, CUNY New York City College of Technology | 2018 - 2020<br/><br/>"
            "<b>Earlier Study</b><br/>Computer and Information Sciences coursework, "
            "Universita degli Studi di Bari | 2000",
            body,
        ),
        Paragraph(
            "<b>Languages</b><br/>English and Italian: Native or bilingual<br/>Spanish: Elementary<br/><br/>"
            "<b>Technical Foundation</b><br/>PHP, SQL, MySQL, SQL Server, REST APIs, Docker, Linux, "
            "Python, automation, reporting, and web systems.",
            body,
        ),
    ]]
    education_table = Table(education_data, colWidths=[3.35 * inch, 3.45 * inch])
    education_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.6, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story.append(education_table)
    doc.build(story)


if __name__ == "__main__":
    build()
    print(OUTPUT)
