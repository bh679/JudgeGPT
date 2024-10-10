const backgroundImages = [
    "brennanhatton_judge_chatgpt_ai_legal_system_in_courtroom.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._1f180d1f-5c23-4b84-9f1f-7e7360a5ff43.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._262855c0-ce00-47a4-946d-43c814dcd12b.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._db5537cc-e696-4798-ae08-a473c6e5bcdc.png",
    "brennanhatton_judge_chatgpt_ai_legal_system_in_courtroom2.png",
    "brennanhatton_judgegpt_d2f49e17-6586-4c84-9f0e-4a1a2447f587.png",
    "brennanhatton_empty_ai_courtroom_of_the_future._4d5f210b-ba41-40cc-a169-d80debd1394b.png",
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
    "brennanhatton_empty_ai_court_held_in_outter_space_galaxy_abyss__daaecb1b-66aa-4200-abec-10c6d3427252.png",
   // "brennanhatton_empty_ai_court_held_in_the_ocean_7e98b546-06c9-4d46-9fbd-96e7e6f1e1f0.png",
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_54386807-c2c7-4a0a-bb76-2bbb034f6086.png",//80
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_7025132c-6794-4583-9552-d59839af4495.png",
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_66f1987b-c0ab-4a33-8d87-f143c3685e60.png",
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_ai__3c10c649-ecb1-4bac-a711-6b559390090c.png",
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_ai__474401e1-fb3c-4867-af0f-33ef10e3cf66.png",
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_ai__09d2f76a-2d2f-44df-a976-54a0a5c80bb2.png",
    "brennanhatton_technology_meets_nature_in_empty_ai_courtroom_ai__d58c6e5f-9663-405e-be00-a7109fc65f01.png",
    "brennanhatton_empty_ai_court_room_time_vs_reality._abyss_portal_4147a5ce-9267-496c-982a-5937d4169b7d.png",
    "brennanhatton_empty_ai_court_room_time_vs_reality._abyss_portal_d13d2edb-393b-4c5f-aad5-849e817d2296.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_0366658d-b75f-4c90-8518-fa6072cbc58c.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_7dfed8d4-64c7-4b4a-934a-e7cf02fb1244.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_0108d82e-7833-44d7-91c1-574436ceea3a.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_bdd05f3a-b98e-4942-885c-8f6bbd737abc.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_0890d1ea-8410-443e-996e-613f74b712e1.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_342ef951-a193-4b3c-b372-f032a0e368c8.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_de955ab2-d21f-4ec2-af26-871b2b6b2996.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_1df7bfb6-0f98-4d8f-ba3e-fa6aee920070.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_2a5d98b7-69ca-4437-858a-272cac4c8fb8.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_da52921b-27ce-4701-8b86-2209ee75a585.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_68253d50-4a5a-4a0e-94f6-458b96fc023e.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_6224c5a7-6976-4da1-97ba-75364bf8aab3.png",//100
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_f8df4490-24c3-439e-ab63-741403e2fdb4.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_cb2c64f2-8b17-424f-b750-05c32f2e6c9e.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_7d79ce08-4e28-4fa0-8df2-34d34e10373b.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_d109447e-5f8e-4078-a550-5cc84f830ef5.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_e1ce34c8-ac16-4871-aec0-25a570b2815f.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_b1bedc08-2c9c-4647-863f-9160846f0b92.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_b059b0e9-4bc7-41ae-8f48-faeefca3feed.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_ba1d474f-bef5-479f-bb21-4387d862918b.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_4530b537-074e-4e77-842b-24c6c5aa79e8.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_aa035a40-4b00-4f81-99d5-886fc49bf4f1.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_8b6a76fd-b6de-469d-a1d5-bf83ddde2e5d.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_86088fb7-f91c-444c-a02d-d17165d40563.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_24439336-103c-4b86-9a6e-b909ecf846db.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_a22d8030-a729-44ae-83a9-79cd5f79ff27.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_5b9a4f30-cdb8-4b57-ba6c-69cb1866b0ff.png",
    "brennanhatton_empty_ai_court_held_in_the_space_between_time_tim_a4a71717-26ca-4efa-9cf5-d8a4a83ceb79.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_898c3c57-85d3-45ff-9443-8a0e19b988c5.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_449068e6-fe59-4336-b392-ba6a379fa591.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_a7d9af0c-ae35-4ba7-83a5-4381275c9adf.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_0a92aacb-2486-4840-835f-334b2adf4e1d.png",//120
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_74ad8057-3389-4021-8429-ed5cc989db30.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_a6b194f0-68f0-41b3-be7e-613cf00a5240.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_cac9d8f3-a0f8-49ac-bd6b-a6aa23942383.png",
    "brennanhatton_non-euclidian_empty_ai_court_held_in_the_space_be_f984aafd-9f3b-467e-a564-fd82c9e3c56d.png",
    "brennanhatton_empty_ai_court_held_in_a_desert_wasteland_16c60478-5f35-4bc6-a7b9-2274cb19c6bc.png",
    "brennanhatton_empty_ai_legal_court_held_in_a_desert_wasteland_c2064fc9-7997-4ea3-af16-3d6bac97975b.png",
    "brennanhatton_empty_ai_legal_court_held_in_a_desert_wasteland_d0d529b9-e4d7-43ce-8944-4ea294a74d5c.png",
    "brennanhatton_empty_ai_legal_court_held_in_a_desert_wasteland_20b9b398-d5cd-4d9f-97f0-ad5777d09543.png",
    "brennanhatton_empty_ai_legal_court_for_the_case_of_life_vs_deat_0cc9a232-6690-407a-8d4c-19d33cb24cad.png",
    "brennanhatton_fractal_courtroom_65de8530-2aab-4f40-86fe-2964294c029d.png"//130

];

var bgId = 0;
var url = 'https://brennan.games/JudgeGPT/';

var backgroundImage = "";

class BackgroundImages
{

    

    static async SetBackground(bgImage)
    {

        if(bgImage == "" || bgImage == null) //for backwards compatability on other pages
        {
            bgId = Math.floor(Math.random() * backgroundImages.length);
            bgImage = backgroundImages[bgId];
        }

        if (backgroundImage === bgImage)
            return;

        backgroundImage = bgImage;

        // Disable the transition for the immediate opacity change
        document.body.style.transition = 'none';
        document.body.style.setProperty('--bg-opacity', 0);  // Instantly set opacity to 0

        // Create new image object
        var img = new Image();

        var imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url + '/images/' + bgImage;
        });

        try 
        {
            await imageLoadPromise;

            document.body.style.transition = 'opacity 0s ease-in-out';  // Set the transition back
            document.body.style.setProperty('--bg-opacity', 0);  // Instantly set opacity to 0

            // Image has loaded, now apply the new background image
            document.documentElement.style.setProperty('--bg-image', `url('${img.src}')`);

             document.body.style.transition = 'opacity 5s ease-in-out';  // Set the transition back
            document.body.style.setProperty('--bg-opacity', 0.75);  // Fade in to opacity 0.75
        } 
        catch (error) 
        {
            console.error("Failed to load image: ", error);
            this.SetBackground();
        }
    }

    /*static async GlitchBackground() {

        // Choose a random image.
        var nextBgId = Math.floor(Math.random() * backgroundImages.length);

        // Create a new image object.
        var img = new Image();

        // Once the image is loaded, switch between the current and glitch image.
        var imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = './images/' + backgroundImages[nextBgId];
        });

        try {
            await imageLoadPromise;

            // Image has loaded, you can continue with the next part of your code.

            var glitchInterval = setInterval(function() {

                if(Math.floor(Math.random()*2)==0)
                    switchBG = './images/' + backgroundImages[bgId];
                else
                    switchBG = './images/' + backgroundImages[nextBgId];

                document.documentElement.style.setProperty('--bg-image', `url(`+switchBG+`)`);
                console.log(getComputedStyle(document.documentElement).getPropertyValue('--bg-image'));

            }, 100);  // Change the image every 100 milliseconds.

            // After 1 second, stop glitching and set the new background image.
            setTimeout(function() {
                clearInterval(glitchInterval);

                bgId = nextBgId;
                var bgImage = './images/'+backgroundImages[bgId];
                document.documentElement.style.setProperty('--bg-image', `url('${bgImage}')`);
                
            }, 3000);  // Stop glitching after 1 second.


        } catch (error) {
            console.error("Failed to load image: ", error);
        }   
    }*/
}

const audioSettingIcon = url+'/images/icon/icon_tool_1.png';

//this is now handled on the backend
const judgeProfileImages = [
    //"brennanhatton_profile_picture_of_judge_gpt_genderless_ai_judge_63826ce4-a661-4b4f-9714-e24c92478dc9.png",
    "brennanhatton_profile_picture_of_judge_gpt_genderless_ai_judge__8afa7999-e05d-4384-893d-1236a802ac63.png"/*,
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_holograph_t_c7599d91-b5e2-4bd5-a058-307300ab8428.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_genderless__e33a0d20-0bcf-4a5e-87aa-918c8fc545b1.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_genderless__c6db7b68-3486-48a2-8f4f-ad3f71c5223b.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_genderless__2ccf8b3f-d800-4344-b865-888aef0d3a6c.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_genderless__29b4582e-bbb8-4888-819e-ccc232666002.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_genderless__af4d9faa-6ea8-4c87-b6e9-7f5fd13850e3.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_genderless__f79644b5-7b4b-4bc7-8fb2-5b31fecab787.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_old_genderl_24aaf35e-a722-46be-a8cb-3f29357efdb6.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_old_genderl_0b9e7c16-63b0-4a9d-bf59-61851d07b4ea.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_old_genderl_15185e1d-2da9-466c-ad99-dd9ed1bac904.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_old_genderl_bd832eac-911f-4de0-a271-5708f8069c41.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_chemical_ho_72598500-f163-4483-ba2c-9f01a0af63e0.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_chemical_ho_83f28a6b-38f2-4850-88b2-718a5aaec10f.png",
    "brennanhatton_profile_picture_of_judge_gpt_ai_judge_chemical_ho_ec42553a-1daa-4291-a0ce-c312c9a453f3.png"*/
 ]


function GetRandomJudgeProfileImage()
{
    return url+'/images/profiles/judge/' + judgeProfileImages[Math.floor(Math.random() * judgeProfileImages.length)];
}

const profileImages = [
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_e2da51d0-fb44-4204-96fe-9bb4c311e862.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_6afb3b07-5722-4095-99b5-674658d56429.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_d5de75c4-d7fa-40e5-b370-b4e97ee8920d.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_b44a92bc-be0e-45d7-add5-349f4c2c0687.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_01f3ff74-4a43-4f8e-b067-e027b01445ba.png",
    "brennanhatton_profile_picture_of_person_preparing_to_go_to_cour_7304d215-0a0f-46ab-a971-5516a8790cc7.png",
    "brennanhatton_profile_picture_of_farmer_49d21a53-7ff1-4017-9691-405c5898ae7c.png",
    "brennanhatton_profile_picture_of_sailor_afb12f26-05d1-45a9-84b7-40d21b7da906.png",
    "brennanhatton_profile_picture_of_farmer_e235a1f8-0ed6-42a2-a0a7-0c681ed7eade.png",
    "brennanhatton_profile_picture_of_farmer_3e4556d9-a298-4f76-b08a-5a9de772830e.png",
    "brennanhatton_profile_picture_of_train_driver_women_b886b9ea-e444-4fcd-ad38-612349d5864d.png",
    "brennanhatton_profile_picture_of_train_driver_women_a63ce0c5-7e85-4bb7-a085-2fa6d6d012a5.png",
    "brennanhatton_profile_picture_of_train_driver_women_8a4eb90c-225f-4302-9900-8140a9a0193b.png",
    "brennanhatton_profile_picture_of_buddhist_monk_7535d7d7-dd08-452f-a7ab-9457a536d512.png",
    "brennanhatton_profile_picture_of_doctor_women_738bcb6e-027a-42d9-aceb-3e05c285bb13.png",
    "brennanhatton_profile_picture_of_doctor_women_ae26d860-9efc-4a55-af55-a391433aed19.png",
    "brennanhatton_profile_picture_of_job_worker_afriacan_5f45333f-dfa3-42b0-959b-0c0884bc3f85.png",
    "brennanhatton_profile_picture_of_farmer_asian_dd9c94d2-b10c-4098-bb27-30047b5d2019.png",
    "brennanhatton_profile_picture_of_farmer_asian_9cf5dfe0-0a28-42ed-b6fb-95bda4309f8d.png",
    "brennanhatton_profile_picture_of_cleaner_caucasion_6a97d4ed-3bf8-463a-818d-a131f4802c66.png",
    "brennanhatton_profile_picture_of_cleaner_caucasion_a373457e-70d0-4ff8-a3a7-22645c2b317d.png",
    "brennanhatton_profile_picture_of_cleaner_caucasion_e217bf0e-f193-487a-84e3-5c749bb4152f.png",
    "brennanhatton_profile_picture_of_cleaner_caucasion_e217bf0e-f193-487a-84e3-5c749bb4152f.png",
    "brennanhatton_profile_picture_of_astronaut_middle_eastern_6f8ffdaf-27b3-4f91-9715-dedfdf00964e.png",
    "brennanhatton_profile_picture_of_farmer_women_black_c38e862d-60b3-4766-8763-d92a57acc4f4.png",
    "brennanhatton_profile_picture_of_farmer_women_black_0bb0f88b-5073-4b29-b7c4-677d372eff77.png",
    "brennanhatton_profile_picture_of_astronaut_women_c4e16431-70c1-42b8-966d-f04259d2ea80.png",
    "brennanhatton_profile_picture_of_astronaut_women_9c4c9bff-3300-40e8-8b73-ca63348941fb.png",
    "brennanhatton_profile_picture_african_journalist_d6d8c9d3-8a1b-44d2-a983-e544d74b888b.png",
    "brennanhatton_profile_picture_african_journalist_c189a87e-2446-49c5-81f9-b70ce1fc9431.png",
    "brennanhatton_profile_picture_african_journalist_068f8043-4ce4-4c58-9170-808fbbd7518a.png",
    "brennanhatton_profile_picture_french_baker_93deafdd-4e10-4617-8e97-24f9e77ed8a1.png",
    "brennanhatton_profile_picture_french_baker_d46f99bb-a3d9-4434-915c-3e8a3b1d6c0b.png",
    "brennanhatton_profile_picture_women_acfrican_b06e53d6-aa7c-4f36-8a61-fd495741e33a.png",
    "brennanhatton_profile_picture_women_acfrican_f00b90e1-999e-48cf-836b-7b13f3005762.png",
    "brennanhatton_profile_picture_black_women_nerd_f7c942ba-4902-4c38-b5cc-01502a0e3d9b.png",
    "brennanhatton_profile_picture_black_women_nerd_80b638aa-e7ad-479a-be92-360c8e6b7343.png",
    "brennanhatton_profile_picture_black_women_nerd_5d8f0f45-9601-4981-aad4-dc5a36d6dc5c.png"

    ];

function GetRandomProfileImage()
{
    return url+'/images/profiles/' + profileImages[Math.floor(Math.random() * profileImages.length)];
}


const brennanProfileImages = [
    "Screenshot%202024-10-02%20at%201.18.41%20pm.png",
    "Screenshot%202024-10-02%20at%201.19.03%20pm.png",
    "Screenshot%202024-10-02%20at%201.19.17%20pm.png",
    "Screenshot%202024-10-02%20at%201.19.27%20pm.png",
    "Screenshot%202024-10-02%20at%201.19.33%20pm.png",
    "Screenshot%202024-10-02%20at%201.19.40%20pm.png",
    "Screenshot%202024-10-02%20at%201.19.48%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.02%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.10%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.20%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.26%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.32%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.40%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.47%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.53%20pm.png",
    "Screenshot%202024-10-02%20at%201.20.59%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.08%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.14%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.23%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.28%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.33%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.40%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.46%20pm.png",
    "Screenshot%202024-10-02%20at%201.21.53%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.01%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.07%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.12%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.18%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.24%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.30%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.35%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.41%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.46%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.53%20pm.png",
    "Screenshot%202024-10-02%20at%201.22.59%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.05%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.13%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.26%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.31%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.37%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.44%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.50%20pm.png",
    "Screenshot%202024-10-02%20at%201.23.57%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.01%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.07%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.14%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.19%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.25%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.31%20pm.png",
    "Screenshot%202024-10-02%20at%201.24.35%20pm.png"
];


function GetRandomBrennanProfileImage()
{
    return url+'/images/profiles/brennan/' + brennanProfileImages[Math.floor(Math.random() * brennanProfileImages.length)];
}


