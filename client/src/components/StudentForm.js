// Provides the admin form for creating and editing student profile records.
import React, { useEffect, useState } from "react";
import "../App.css";
import { MdClose } from "react-icons/md";

// Renders the student form; receives submit/change/close handlers and form values, returns form UI.
function StudentForm({ handleSubmit, handleOnChange, handleclose, rest = {} }) {
  const [isMotherEmployed, setIsMotherEmployed] = useState(false);
  const [isFatherEmployed, setIsFatherEmployed] = useState(false);
  const [hasSiblings, setHasSiblings] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Keeps conditional form sections aligned when an existing student is opened for editing.
  useEffect(() => {
    setIsMotherEmployed(Boolean(rest.isMotherEmployed));
    setIsFatherEmployed(Boolean(rest.isFatherEmployed));
    setHasSiblings(Boolean(rest.hasSiblings));
  }, [rest]);

  // Normalizes checkbox and file input changes before passing them to the parent form state.
  const onInputChange = (e) => {
    const { name, checked, files, type } = e.target;

    if (type === "checkbox") {
      if (name === "isMotherEmployed") {
        setIsMotherEmployed(checked);
      }

      if (name === "isFatherEmployed") {
        setIsFatherEmployed(checked);
      }

      if (name === "hasSiblings") {
        setHasSiblings(checked);
      }
    }

    if (name === "image" && files && files[0]) {
      setImagePreview(URL.createObjectURL(files[0]));
    }

    handleOnChange(e);
  };

  return (
    <div className='addContainer'>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!rest.name || !rest.grade || !rest.class) {
            alert("Please fill all required fields");
            return;
          }

          handleSubmit(e);
        }}
      >
        <div className='close-btn' onClick={handleclose}>
          <MdClose />
        </div>

        <label htmlFor='image'>Select an Image:</label>
        <input type='file' id='image' name='image' onChange={onInputChange} />

        {imagePreview ? (
          <img width={100} height={100} src={imagePreview} alt='Selected student preview' />
        ) : null}

        <label htmlFor='name'>Full Name:</label>
        <input type='text' id='name' name='name' onChange={onInputChange} value={rest.name || ""} />

        <label htmlFor='grade'>Grade:</label>
        <input
          type='number'
          id='grade'
          name='grade'
          onChange={onInputChange}
          value={rest.grade || ""}
        />

        <label htmlFor='class'>Class:</label>
        <select id='class' name='class' onChange={onInputChange} value={rest.class || ""}>
          <option value=''>Select Class</option>
          <option value='A'>Class A</option>
          <option value='B'>Class B</option>
          <option value='C'>Class C</option>
          <option value='D'>Class D</option>
          <option value='E'>Class E</option>
        </select>

        <label htmlFor='address'>Address:</label>
        <input
          type='text'
          id='address'
          name='address'
          onChange={onInputChange}
          value={rest.address || ""}
        />

        <label htmlFor='motherName'>Mother's Name:</label>
        <input
          type='text'
          id='motherName'
          name='motherName'
          onChange={onInputChange}
          value={rest.motherName || ""}
        />

        <label htmlFor='fatherName'>Father's Name:</label>
        <input
          type='text'
          id='fatherName'
          name='fatherName'
          onChange={onInputChange}
          value={rest.fatherName || ""}
        />

        <label htmlFor='motherMobile'>Mother's Mobile:</label>
        <input
          type='text'
          id='motherMobile'
          name='motherMobile'
          onChange={onInputChange}
          value={rest.motherMobile || ""}
        />

        <label htmlFor='fatherMobile'>Father's Mobile:</label>
        <input
          type='text'
          id='fatherMobile'
          name='fatherMobile'
          onChange={onInputChange}
          value={rest.fatherMobile || ""}
        />

        <label htmlFor='homeMobile'>Home Mobile:</label>
        <input
          type='text'
          id='homeMobile'
          name='homeMobile'
          onChange={onInputChange}
          value={rest.homeMobile || ""}
        />

        <label htmlFor='isMotherEmployed'>Is Mother Employed?</label>
        <input
          type='checkbox'
          id='isMotherEmployed'
          name='isMotherEmployed'
          onChange={onInputChange}
          checked={isMotherEmployed}
        />

        {isMotherEmployed && (
          <>
            <label htmlFor='motherEmployerName'>Mother's Employer Name:</label>
            <input
              type='text'
              id='motherEmployerName'
              name='motherEmployerName'
              onChange={onInputChange}
              value={rest.motherEmployerName || ""}
            />

            <label htmlFor='motherJobPosition'>Mother's Job Position:</label>
            <input
              type='text'
              id='motherJobPosition'
              name='motherJobPosition'
              onChange={onInputChange}
              value={rest.motherJobPosition || ""}
            />
          </>
        )}

        <label htmlFor='isFatherEmployed'>Is Father Employed?</label>
        <input
          type='checkbox'
          id='isFatherEmployed'
          name='isFatherEmployed'
          onChange={onInputChange}
          checked={isFatherEmployed}
        />

        {isFatherEmployed && (
          <>
            <label htmlFor='fatherEmployerName'>Father's Employer Name:</label>
            <input
              type='text'
              id='fatherEmployerName'
              name='fatherEmployerName'
              onChange={onInputChange}
              value={rest.fatherEmployerName || ""}
            />

            <label htmlFor='fatherJobPosition'>Father's Job Position:</label>
            <input
              type='text'
              id='fatherJobPosition'
              name='fatherJobPosition'
              onChange={onInputChange}
              value={rest.fatherJobPosition || ""}
            />
          </>
        )}

        <label htmlFor='hasSiblings'>Does the student have siblings?</label>
        <input
          type='checkbox'
          id='hasSiblings'
          name='hasSiblings'
          onChange={onInputChange}
          checked={hasSiblings}
        />

        {hasSiblings && (
          <>
            <label htmlFor='sibling1Name'>Sibling 1 Name and Class:</label>
            <input
              type='text'
              id='sibling1Name'
              name='sibling1Name'
              onChange={onInputChange}
              value={rest.sibling1Name || ""}
            />

            <label htmlFor='sibling2Name'>Sibling 2 Name and Class:</label>
            <input
              type='text'
              id='sibling2Name'
              name='sibling2Name'
              onChange={onInputChange}
              value={rest.sibling2Name || ""}
            />
          </>
        )}

        <button type='submit' className='btn'>
          Submit
        </button>
      </form>
    </div>
  );
}

export default StudentForm;
