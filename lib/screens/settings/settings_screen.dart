import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/settings_provider.dart';
import '../../core/constants/app_constants.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SettingsProvider>().loadSettings();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: Consumer<SettingsProvider>(
        builder: (context, settingsProvider, child) {
          if (settingsProvider.isLoading || settingsProvider.settings == null) {
            return const Center(child: CircularProgressIndicator());
          }

          final settings = settingsProvider.settings!;

          return ListView(
            children: [
              _buildSection(
                title: 'Video Settings',
                children: [
                  ListTile(
                    title: const Text('Default Video Duration'),
                    subtitle: Text('${settings.defaultVideoDuration} seconds'),
                    trailing: DropdownButton<int>(
                      value: settings.defaultVideoDuration,
                      items: AppConstants.videoDurations.map((duration) {
                        return DropdownMenuItem(
                          value: duration,
                          child: Text('$duration sec'),
                        );
                      }).toList(),
                      onChanged: (value) {
                        if (value != null) {
                          settingsProvider.updateVideoDuration(value);
                        }
                      },
                    ),
                  ),
                ],
              ),
              _buildSection(
                title: 'Notifications',
                children: [
                  SwitchListTile(
                    title: const Text('Enable Notifications'),
                    subtitle: const Text('Get reminded to record daily'),
                    value: settings.notificationsEnabled,
                    onChanged: (value) {
                      settingsProvider.updateNotificationsEnabled(value);
                    },
                  ),
                  ListTile(
                    title: const Text('Reminder Time'),
                    subtitle: Text(settings.reminderTime),
                    enabled: settings.notificationsEnabled,
                    onTap: settings.notificationsEnabled
                        ? () => _showTimePicker(context, settingsProvider)
                        : null,
                  ),
                ],
              ),
              _buildSection(
                title: 'Appearance',
                children: [
                  SwitchListTile(
                    title: const Text('Dark Theme'),
                    subtitle: const Text('Use dark mode'),
                    value: settings.isDarkTheme,
                    onChanged: (value) {
                      settingsProvider.updateTheme(value);
                    },
                  ),
                ],
              ),
              _buildSection(
                title: 'About',
                children: [
                  const ListTile(
                    title: Text('Version'),
                    subtitle: Text('1.0.0'),
                  ),
                  ListTile(
                    title: const Text('Privacy Policy'),
                    onTap: () {
                      // TODO: Open privacy policy
                    },
                  ),
                  ListTile(
                    title: const Text('Terms of Service'),
                    onTap: () {
                      // TODO: Open terms of service
                    },
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            title,
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
              color: Theme.of(context).primaryColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        ...children,
        const SizedBox(height: 8),
      ],
    );
  }

  Future<void> _showTimePicker(
    BuildContext context,
    SettingsProvider settingsProvider,
  ) async {
    final currentTime = settingsProvider.settings!.reminderTime.split(':');
    final initialTime = TimeOfDay(
      hour: int.parse(currentTime[0]),
      minute: int.parse(currentTime[1]),
    );

    final pickedTime = await showTimePicker(
      context: context,
      initialTime: initialTime,
    );

    if (pickedTime != null) {
      final formattedTime = '${pickedTime.hour.toString().padLeft(2, '0')}:'
          '${pickedTime.minute.toString().padLeft(2, '0')}';
      settingsProvider.updateReminderTime(formattedTime);
    }
  }
}