
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    domain: "Web Development",
    position: "Member",
    srn: "",
    email: "",
    linkedin: "",
    github: "",
    branch: "",
    semester: "1",
    bio: "",
  });

  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
  event.preventDefault();

  if (!photo) {
    setMessage("Please select a profile picture.");
    return;
  }

  if (form.bio.trim().length < 150 || form.bio.trim().length > 200) {
    setMessage("Your bio must contain 150–200 characters.");
    return;
  }

  setIsSubmitting(true);
  setMessage("");

  let uploadedPath = null;

  try {
    // 1. Convert the selected picture to WebP.
    const webpPhoto = await convertToWebP(photo);

    // 2. Create a unique filename.
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
    uploadedPath = fileName;

    // 3. Upload the picture to Supabase Storage.
    const { error: uploadError } = await supabase.storage
      .from("member-photos")
      .upload(fileName, webpPhoto, {
        contentType: "image/webp",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. Get the public URL of the uploaded picture.
    const { data: urlData } = supabase.storage
      .from("member-photos")
      .getPublicUrl(fileName);

    // 5. Save the member details in the database.
    const { error: insertError } = await supabase
      .from("members")
      .insert({
        name: form.name.trim(),
        domain: form.domain,
        position: form.position,
        srn: form.srn.trim(),
        email: form.email.trim(),
        linkedin_url: form.linkedin || null,
        github_url: form.github || null,
        branch: form.branch.trim(),
        semester: Number(form.semester),
        bio: form.bio.trim(),
        photo_url: urlData.publicUrl,
      });

    if (insertError) {
      throw insertError;
    }

    setMessage("Registration submitted successfully! Your application is pending review.");

  } catch (error) {
    console.error("Registration error:", error);
    setMessage(`Registration failed: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← Back to Home</a>

      <section style={styles.container}>
        <p style={styles.eyebrow}>EMBRIONE · MEET THE TEAM</p>
        <h1 style={styles.heading}>Join the team.</h1>
        <p style={styles.description}>
          Tell us about yourself and your role in Embrione.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full Name *
            <input name="name" value={form.name} onChange={updateField}
              placeholder="Your full name" required style={styles.input} />
          </label>

          <label style={styles.label}>
            Domain *
            <select name="domain" value={form.domain} onChange={updateField}
              style={styles.input}>
              {["Web Development", "Design", "Logistics", "Operations",
                "Sponsorship", "Hospitality", "Social Media",
                "Event Management"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Position *
            <select name="position" value={form.position} onChange={updateField}
              style={styles.input}>
              {["Head", "Vice-Head", "Core Member", "Member"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            SRN *
            <input name="srn" value={form.srn} onChange={updateField}
              placeholder="Your student registration number" required
              style={styles.input} />
          </label>

          <label style={styles.label}>
            Email *
            <input name="email" type="email" value={form.email}
              onChange={updateField} placeholder="you@example.com"
              required style={styles.input} />
          </label>

          <label style={styles.label}>
            LinkedIn URL
            <input name="linkedin" type="url" value={form.linkedin}
              onChange={updateField} placeholder="https://linkedin.com/in/..."
              style={styles.input} />
          </label>

          <label style={styles.label}>
            GitHub URL
            <input name="github" type="url" value={form.github}
              onChange={updateField} placeholder="https://github.com/..."
              style={styles.input} />
          </label>

          <label style={styles.label}>
            Branch *
            <input name="branch" value={form.branch} onChange={updateField}
              placeholder="e.g. Computer Science" required style={styles.input} />
          </label>

          <label style={styles.label}>
            Semester *
            <select name="semester" value={form.semester} onChange={updateField}
              style={styles.input}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Short Bio *
            <textarea name="bio" value={form.bio} onChange={updateField}
              placeholder="Write 150–200 characters about yourself"
              minLength={150} maxLength={200} required rows={4}
              style={{ ...styles.input, resize: "vertical" }} />
            <span style={styles.counter}>{form.bio.length}/200 characters (minimum 150)</span>
          </label>

          <label style={styles.label}>
            Profile Picture
            <input type="file" accept="image/*" required
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
              style={styles.input} />
            {photo && <span style={styles.counter}>Selected: {photo.name}</span>}
          </label>

          <div style={styles.preview}>
            <p style={styles.eyebrow}>LIVE PREVIEW</p>
            <h2 style={{ margin: "8px 0" }}>{form.name || "Your Name"}</h2>
            <p style={styles.purple}>{form.position} · {form.domain}</p>
            <p style={styles.previewBio}>{form.bio || "Your bio will appear here."}</p>
          </div>

          
<button
  type="submit"
  disabled={isSubmitting}
  style={styles.button}
>
  {isSubmitting ? "Submitting..." : "Submit Registration →"}
</button>


          {message && <p role="status" style={styles.message}>{message}</p>}
        </form>
      </section>
    </main>
  );
}
function convertToWebP(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const imageURL = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(imageURL);

          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not convert image to WebP."));
          }
        },
        "image/webp",
        0.85
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageURL);
      reject(new Error("Could not read the selected image."));
    };

    image.src = imageURL;
  });
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#09090f",
    color: "#fff",
    padding: "32px 20px 60px",
    fontFamily: "Arial, sans-serif",
  },
  back: { color: "#c4b5fd", textDecoration: "none" },
  container: { maxWidth: "650px", margin: "40px auto" },
  eyebrow: { color: "#a78bfa", letterSpacing: "3px", fontSize: "12px" },
  heading: { fontSize: "clamp(36px, 7vw, 56px)", margin: "12px 0" },
  description: { color: "#aaaabc", lineHeight: 1.7 },
  form: { display: "grid", gap: "20px", marginTop: "32px" },
  label: { display: "grid", gap: "9px", fontSize: "14px", color: "#e5e5ef" },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#15151f",
    border: "1px solid #353545",
    borderRadius: "8px",
    padding: "13px",
    color: "#fff",
    fontSize: "15px",
  },
  counter: { color: "#9999aa", fontSize: "12px" },
  preview: {
    background: "#15151f",
    border: "1px solid #39304f",
    borderRadius: "12px",
    padding: "22px",
    marginTop: "8px",
  },
  purple: { color: "#c4b5fd" },
  previewBio: { color: "#b5b5c5", lineHeight: 1.6, overflowWrap: "anywhere" },
  button: {
    background: "#8b5cf6",
    color: "#fff",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: { color: "#c4b5fd" },
};
