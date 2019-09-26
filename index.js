import React, {Component} from 'react';
import {View, StyleSheet, PanResponder, Dimensions} from 'react-native';
import WebView from 'react-native-webview';
import htmlContent from './h5/html';
import injectedSignaturePad from './h5/js/signature_pad';
import injectedApplication from './h5/js/app';

const styles = StyleSheet.create({
    webBg: {
        width: '100%',
        backgroundColor: '#FFF',
        flex: 1
    }
});

class SignatureView extends Component {
    static defaultProps = {
        webStyle: '',
        onOK: () => {
        },
        onEmpty: () => {
        },
        descriptionText: 'Sign above',
        clearText: 'Clear',
        confirmText: 'Confirm',
    };

    constructor(props) {
        super(props);
        const {descriptionText, clearText, confirmText, emptyText, webStyle} = props;
        this.state = {
            base64DataUrl: props.dataURL || null
        };

        const injectedJavaScript = injectedSignaturePad + injectedApplication;
        let html = htmlContent(injectedJavaScript);
        html = html.replace('<%style%>', webStyle);
        html = html.replace('<%description%>', descriptionText);
        html = html.replace('<%confirm%>', confirmText);
        html = html.replace('<%clear%>', clearText);

        this.source = {html};
    };

    getSignature = e => {
        const {onOK, onEmpty} = this.props;
        if (e.nativeEvent.data === "EMPTY") {
            onEmpty();
        } else {
            onOK(e.nativeEvent.data);
        }
    };

    _renderError = args => {
        console.log("error", args);
    };

    _panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,

        onMoveShouldSetPanResponder: (evt, gestureState) => true,

        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        onPanResponderMove: (e, gestureState) => {
            if ((Math.abs(gestureState.dx) > 0) || (Math.abs(gestureState.dy) > 0))
                this.props.hasSigned(true)
            else
                this.props.hasSigned(false)
            return true
        }
    })

    render() {
        return (
            <View
                style={styles.webBg}>
                <WebView
                    {...this._panResponder.panHandlers}
                    androidHardwareAccelerationDisabled
                    useWebKit={true}
                    source={this.source}
                    onMessage={this.getSignature}
                    javaScriptEnabled={true}
                    onError={this._renderError}
                />
            </View>
        );
    }
}

export default SignatureView;
