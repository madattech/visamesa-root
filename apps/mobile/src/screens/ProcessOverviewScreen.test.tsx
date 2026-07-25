import ProcessOverviewScreen from '@/screens/ProcessOverviewScreen';
import {renderComponent} from '@/test/testRenderer';

jest.mock('@/components/layout/CollapsingHeaderScreen', () => {
  const React = require('react');
  const {Text, View} = require('react-native');

  return {
    CollapsingHeaderScreen: ({
      title,
      children,
    }: {
      title: string;
      children: React.ReactNode;
    }) =>
      React.createElement(
        View,
        null,
        React.createElement(Text, null, title),
        children,
      ),
  };
});

describe('ProcessOverviewScreen', () => {
  it('renders localized overview content from i18n', () => {
    const tree = renderComponent(<ProcessOverviewScreen />);
    const output = JSON.stringify(tree.toJSON());

    expect(output).toContain('How VisaMesa works');
    expect(output).toContain('Before you start');
    expect(output).toContain('Profile tab');
    expect(output).toContain('Create your account');
    expect(output).toContain('The 6 TIE steps');
    expect(output).toContain('VisaMesa helps you book');
  });
});
