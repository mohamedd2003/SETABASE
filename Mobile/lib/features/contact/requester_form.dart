import 'package:material_ui/material_ui.dart';

import '../../data/models/requests.dart';
import '../../data/static/app_copy.dart';
import '../../design_system/widgets/form_fields.dart';
import 'submission.dart';

/// The text fields of a package request, owned by the planner screen.
class RequesterFields {
  final name = TextEditingController();
  final company = TextEditingController();
  final email = TextEditingController();
  final phone = TextEditingController();
  final message = TextEditingController();

  /// Errors keyed like the API's (`requester.email`), so server errors land on the right field.
  Map<String, String> validate() => {
    'requester.name': ?Validate.name(name.text),
    'requester.company': ?Validate.requiredCompany(company.text),
    'requester.email': ?Validate.email(email.text),
    'requester.phone': ?Validate.phone(phone.text),
  };

  Requester toRequester() =>
      Requester(name: name.text, company: company.text, email: email.text, phone: phone.text, message: message.text);

  void clear() {
    for (final c in [name, company, email, phone, message]) {
      c.clear();
    }
  }

  void dispose() {
    for (final c in [name, company, email, phone, message]) {
      c.dispose();
    }
  }
}

class RequesterForm extends StatelessWidget {
  const RequesterForm({super.key, required this.fields, required this.errors});

  final RequesterFields fields;
  final Map<String, String> errors;

  @override
  Widget build(BuildContext context) => AutofillGroup(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SetaTextField(
          label: AppCopy.fieldYourName,
          controller: fields.name,
          errorText: errors['requester.name'],
          maxLength: 120,
          autofillHints: const [AutofillHints.name],
          textCapitalization: TextCapitalization.words,
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: 18),
        SetaTextField(
          label: AppCopy.fieldCompany,
          controller: fields.company,
          errorText: errors['requester.company'],
          maxLength: 120,
          autofillHints: const [AutofillHints.organizationName],
          textCapitalization: TextCapitalization.words,
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: 18),
        SetaTextField(
          label: AppCopy.fieldWorkEmail,
          hint: AppCopy.fieldWorkEmailHint,
          controller: fields.email,
          errorText: errors['requester.email'],
          keyboardType: TextInputType.emailAddress,
          autofillHints: const [AutofillHints.email],
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: 18),
        SetaTextField(
          label: AppCopy.fieldPhoneOptional,
          hint: AppCopy.fieldPhoneHint,
          controller: fields.phone,
          errorText: errors['requester.phone'],
          maxLength: 30,
          keyboardType: TextInputType.phone,
          autofillHints: const [AutofillHints.telephoneNumber],
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: 18),
        SetaTextField(
          label: AppCopy.fieldAnythingElse,
          controller: fields.message,
          errorText: errors['requester.message'],
          maxLines: 4,
          maxLength: 2000,
          keyboardType: TextInputType.multiline,
          textCapitalization: TextCapitalization.sentences,
        ),
      ],
    ),
  );
}
