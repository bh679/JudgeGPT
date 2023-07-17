const backgroundImages = [
    "brennanhatton_judge_chatgpt_ai_legal_system_in_courtroom.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._1f180d1f-5c23-4b84-9f1f-7e7360a5ff43.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._262855c0-ce00-47a4-946d-43c814dcd12b.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._db5537cc-e696-4798-ae08-a473c6e5bcdc.png",
    "brennanhatton_judge_chatgpt_ai_legal_system_in_courtroom2.png",
    "brennanhatton_judgegpt_d2f49e17-6586-4c84-9f0e-4a1a2447f587.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._4d5f210b-ba41-40cc-a169-d80debd1394b",
    "brennanhatton_empty_ai_courtroom_of_the_future._bd41af81-d2e1-436e-8ce5-b0558089a97a.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._2cb44abf-01b1-4967-b6a7-ab7fb6055c67.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._2bd9c3bf-2e9e-47d6-a05b-1766eb5947e1.png",//
    "brennanhatton_empty_ai_courtroom_of_the_future._941696f7-8f96-4f2e-b323-b21a2819df71.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._d5574efe-36b4-4514-973f-3939f60eac2a.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_c365131f-6d39-4a52-87ca-f336684f3483.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_55938dc5-0907-46a4-9f8e-dfd7050315cf.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_4dec2071-4eac-496a-bf82-eaeeb48d3a7d.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_a9d4ade1-ee44-45cf-80af-3b6fb763dbd0.png",//16
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_06ba24aa-2284-4613-8cc9-cad5593d1a52.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_435311f0-f4dc-4af4-b02a-562a10bfb0f0.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_f2e6863b-0b2a-4a40-84e9-b44160e38fa1.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_5757c8a9-1a05-41a6-86a6-4f0b55564403.png",//20
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_9eb4d2a2-2499-491a-96fa-afb4aa78ed25.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_abandon_lush_aby_dffda9d6-fa0a-400a-99b2-ca4c3a2f1d87.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_dystopia_08b275e0-2b2d-452b-8316-95d5ab15019f.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_dystopia_6bb32247-a6ab-44c4-bdce-b27136a9b81c.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_dystopia_evil_218e7f74-b499-41df-9e72-49828e9f50fc.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_dystopia_evil_205825b7-d574-4c0d-b9d0-ab6611954bc9.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_fa041313-8b87-43e0-ab0d-c3b30587432c.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_dea7379f-2c2e-4869-9e1f-35ada0972407.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_c02f26b5-12ec-4d34-9576-b9e6ef3eb9a2.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_balanced__0f64e8b0-d6c3-4ca7-8ed9-476d29478b78.png",//30
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_balanced__33e6d26f-f715-4dc0-bc5d-ede3d8a34e40.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_balanced__ac0c5ccb-4c78-4e28-9f6d-85d99f9df0ed.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_utopia_balanced__5438409c-a0f9-45e6-bf81-e5eca0dfc4c9.png",
    "brennanhatton_empty_ai_courtroom_of_the_future__utopia_balanced_c7341779-eb53-4a26-b28e-598f79185995.png",
    "brennanhatton_empty_ai_courtroom_of_the_future__utopia_balanced_0e5d108b-d866-463c-90f2-4d02642932b8.png",
    "brennanhatton_empty_ai_courtroom_of_the_future__utopia_balanced_227a35a1-5be3-43bd-b893-8712a5e7bbba.png",
    "brennanhatton_empty_ai_courtroom_of_the_future__utopia_balanced_85f35667-a6b2-4b10-92c3-6cf79bea3bfd.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_holographic_digi_e2877b14-ae94-4870-ba84-f42c2b7a6e41.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_holographic_digi_f633b2bf-401f-4468-b0df-e153ad39af72.png",//40
    "brennanhatton_empty_ai_courtroom_of_the_future_holographic_digi_23f4a18a-ca88-45bf-9029-e56f3d6eca86.png",
    "brennanhatton_projection_of_empty_ai_courtroom_of_the_future_ho_c919149e-ca99-4fee-a753-c6181be28f28.png",
    "brennanhatton_projection_of_empty_ai_courtroom_of_the_future_ho_ced4c316-b207-4068-8ea8-ddd5d519faa3.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_12d3c5bf-8d9e-469c-9410-de40b599a959.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_219f42e8-313d-4628-a7a5-4b7aae0a8abf.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_6f850448-5a96-4e02-8310-ce5c1d306b95.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_e0d6bc99-e97a-4ed1-97f3-6b7bc5288f53.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_7c8e1c31-03a6-40ce-b782-404b9b2f2395.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_684d29e3-d34c-4686-a4d6-5ed8bdb76a26.png",//50
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_d92c137c-5591-4e60-a321-b88e4cee4188.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_matrix_digital_v_bd809798-bc5f-4cc9-a840-939c01ba7d5d.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_minority_report_3734b044-3406-4752-ab59-0ca037f0874b.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_minority_report_b8229584-00dc-4302-b759-0079eb2f04f3.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_minority_report_72cb7ed6-8339-418e-92a3-a0ab0ef4f3c6.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_space_galaxy_aby_e5a0171e-f88c-43c8-ae90-8cd23aec5378.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_space_galaxy_aby_71684b55-fb86-4c4b-a176-cabfe765842a.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_space_galaxy_aby_d94a2e55-558d-4d60-ac33-6d996586c59e.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_space_galaxy_aby_3bbcacb2-e373-47c3-8cee-546e3a5deed4.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_held_in_outter_s_b982aef1-1e73-4cc6-a18c-7eb8b051799c.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_held_in_outter_s_6c978a08-7950-4629-9d7f-bbad6a5c55c0.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_held_in_outter_s_757e26a6-2f2c-41ea-9b68-4d7f33335f2a.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_held_in_outter_s_f68eeb96-d899-437e-b6d7-d9aee064936f.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__5b26e6e9-3e17-4f23-9ade-4a5fafc7ce26.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__8856f348-babc-4d52-9eb1-4a10a164dc15.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__83bc6359-b285-491d-8c9d-8a5a38272c18.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__a7d04a2e-b69e-495a-ab6b-fdd3a8de7b6b.png", //65
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__a9897f47-3218-466e-ba0e-a36f4a1aadab.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__9cfb869d-015c-473f-8195-028d9371f52f.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__d97e8e72-4027-4d9f-8259-d644825e2409.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__b21d805b-eaa1-48d3-b36e-ed96afcce766.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_alien_bio_858d3762-5857-4c51-beae-d544a4e65caf.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_alien_bio_61c56120-17ba-476e-ab6d-ba8e477ed93e.png",//70
    "brennanhatton_empty_ai_courtroom_of_the_future_alien_biology_sp_5f6338a2-51e5-4d08-b981-7c8b78a83121.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_alien_biology_sp_823520d5-621c-43f7-8a8a-db1f95c59d62.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_alien_biology_sp_ebae27d4-cc7c-4754-b4be-6155d4decc9d.png",
    "brennanhatton_empty_ai_courtroom_of_the_future_alien_biology_sp_71d31ebe-0c44-4dce-a4c7-4357c802ce42.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__21afdafa-51de-4979-839d-975a8f38eea2.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__96f4d634-c942-47fe-9425-9af8157ed7ee.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__01065281-2fc6-4d6a-b8e8-9022e0a9a05e.png",
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__daaecb1b-66aa-4200-abec-10c6d3427252.png"
];
const backgroundImagesCount = 78;

function SetBackground()
{
    var bgImage = backgroundImages[Math.floor(Math.random() * backgroundImagesCount)];
    document.body.style.setProperty('--bg-opacity', 0);

            // Create new image object
    var img = new Image();

    // Assign source to image object
    img.src = './images/'+bgImage;

    // Once image is loaded, update CSS variable
    img.onload = function() {
        document.body.style.setProperty('--bg-opacity', 0);
        document.documentElement.style.setProperty('--bg-image', `url('${img.src}')`);

        // Then, fade in the background
        document.body.style.setProperty('--bg-opacity', 0.5);
    };

}
