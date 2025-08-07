#########################################################################################
# file: update_urls_in_file.py
# type: Python
# date: 06_AUGUST_2025
# author: karbytes
# license: PUBLIC_DOMAIN 
#########################################################################################

def replace_in_file(file_name, old_string, new_string):
    try:
        # Read the content of the file (named thing.html).
        with open(file_name, 'r', encoding='utf-8') as file:
            content = file.read()

        # Replace the old string with the new string.
        updated_content = content.replace(old_string, new_string)

        # Write the updated content back to the file (named thing.html).
        with open(file_name, 'w', encoding='utf-8') as file:
            file.write(updated_content)

        print(f"Replaced all instances of '{old_string}' with '{new_string}' in {file_name}.")
    except FileNotFoundError:
        print(f"Error: The file '{file_name}' was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Parameters
file_name = "thing.html"
#old_string = "https://raw.githubusercontent.com/karlinarayberinger/KARLINA_OBJECT_extension_pack_41/main/"
#new_string = "/KARLINA_OBJECT_extension_pack_41/"

# Execute the function
replace_in_file(file_name, old_string, new_string)
